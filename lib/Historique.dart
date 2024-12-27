import 'package:flutter/material.dart';

class Historique extends StatefulWidget {
  const Historique({super.key});

  @override
  State<Historique> createState() => _HistoriqueState();
}

class _HistoriqueState extends State<Historique> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historique'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            // Retour à la page précédente (la page de calcul du polynôme)
            Navigator.pop(context);
          },
        ),
      ),
      body: const Center(
        child: Text('History of previous calculations will be shown here.'),
      ),
    );
  }
}