import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart'; // For storing JWT token


class ApiService {
  final String baseUrl = "http://localhost:8081/api/public"; // Adresse de votre backend

  Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse("$baseUrl/login");
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"username": email, "password": password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to login: ${response.body}");
    }
  }

  Future<Map<String, dynamic>> register(String email, String password) async {
    final url = Uri.parse("$baseUrl/register");
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to register: ${response.body}");
    }
  }


  // Method to retrieve the JWT token from SharedPreferences
  Future<String?> getJwtToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  // Example of how to make an authenticated request
  final String baseUrll = "http://localhost:8081/api"; // Your API base URL

  // Method to get data from an API (e.g., authenticated request)
  Future<Map<String, dynamic>> getData(String endpoint) async {
    final jwtToken = await getJwtToken(); // Retrieve the token

    if (jwtToken == null) {
      throw Exception("No JWT token found. Please log in first.");
    }

    final url = Uri.parse("$baseUrll/$endpoint");
    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $jwtToken", // Add the token to the Authorization header
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to fetch data: ${response.body}");
    }
  }
}

