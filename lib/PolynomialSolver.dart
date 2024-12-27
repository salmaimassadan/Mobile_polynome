import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart'; // For storing JWT token

import 'package:projet_poly/Historique.dart';
import 'package:projet_poly/Login.dart';

class PolynomialSolver extends StatelessWidget {
  const PolynomialSolver({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const PolynomialSolverPage(),
    );
  }
}

class PolynomialSolverPage extends StatefulWidget {
  const PolynomialSolverPage({super.key});

  @override
  _PolynomialSolverPageState createState() => _PolynomialSolverPageState();
}

class _PolynomialSolverPageState extends State<PolynomialSolverPage> {
  final List<TextEditingController> _coefficientControllers = [
    TextEditingController(),
    TextEditingController(),
    TextEditingController()
  ];

  String _result = "";
  bool _isLoading = false;

  final String apiUrl = 'http://localhost:8081/api'; // Adjust based on device

  // Retrieve JWT token from storage
  Future<String?> getJwtToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  Future<void> _calculateRootsViaAPI() async {
    setState(() {
      _isLoading = true;
      _result = "";
    });

    try {
      final coefficients = _coefficientControllers
          .map((controller) {
            final value = controller.text;
            if (value.isEmpty) return null;
            final parsedValue = double.tryParse(value);
            return parsedValue ?? -1.0;
          })
          .toList();

      if (coefficients.contains(null)) {
        setState(() {
          _result = "Please fill in all coefficient fields with valid numbers.";
        });
        return;
      }

      // Get the JWT token
      final String? jwtToken = await getJwtToken();

      if (jwtToken == null) {
        setState(() {
          _result = "You must be logged in to calculate.";
        });
        return;
      }

      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $jwtToken', // Add token in the Authorization header
        },
        body: jsonEncode({'coefficients': coefficients}),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        setState(() {
          _result = responseData['result'] ?? 'No result received';
        });
      } else {
        setState(() {
          _result = 'Error: ${response.statusCode} - ${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        _result = "Error: ${e.toString()}";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _addCoefficientField() {
    setState(() {
      _coefficientControllers.add(TextEditingController());
    });
  }

  void _resetFields() {
    for (var controller in _coefficientControllers) {
      controller.clear();
    }
    setState(() {
      _result = "";
    });
  }

  void _navigateToHistory() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const Historique()),
    );
  }

  void _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token'); // Remove JWT token on logout

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const Login()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Polynomial Solver'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
            tooltip: 'Logout',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Enter coefficients for your polynomial equation (e.g., ax² + bx + c)',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: _coefficientControllers.length,
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 3,
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: TextField(
                        controller: _coefficientControllers[index],
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Coefficient for x^${_coefficientControllers.length - index - 1}',
                          border: const OutlineInputBorder(),
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _coefficientControllers[index].clear();
                            },
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: _resetFields,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
                  child: const Text('Reset'),
                ),
                ElevatedButton(
                  onPressed: _isLoading ? null : _calculateRootsViaAPI,
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Calculate'),
                ),
                ElevatedButton(
                  onPressed: _addCoefficientField,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                  child: const Text('Add Coefficient'),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              'Results',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue),
              ),
              child: Text(
                _result,
                style: const TextStyle(fontSize: 16),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _navigateToHistory,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              child: const Text('History'),
            ),
          ],
        ),
      ),
    );
  }
}
