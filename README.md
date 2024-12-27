# Application de Calcul de Polynômes



Cette application permet aux utilisateurs de calculer les résultats de polynômes en entrant simplement les coefficients. L'application utilise plusieurs technologies pour offrir une expérience sécurisée et fluide.

## Table des matières

- [Architecture logicielle](#Architecture-logicielle)
- [Docker Image](#Docker-Image)
- [Frontend](#Frontend)
- [Backend](#Backend)
- [Démarrage](#Démarrage)
- [Démonstration Vidéo](#Démonstration-Vidéo)
- [Contribuer](#Contribuer)

## Architecture logicielle

L'architecture de l'application utilise **Spring Boot** pour le backend avec **Spring Security** pour la gestion de la sécurité. Le frontend est développé en **Angular** avec l'utilisation de **Flutter** pour la partie mobile.

### Diagramme de l'architecture

+-----------------+         +------------------+         +------------------+  
|                 |         |                  |         |                  |  
|   Frontend     |  <----> |   API Backend    |  <----> |  Database        |  
|  (Angular +    |         |  (Spring Boot)   |         |   (MySQL)        |  
|   Dart)        |         |                  |         |                  |  
+-----------------+         +------------------+         +------------------+  
          |                         |                           |    
   +----------------+          +-------------------+            |    
   | Authentication |          | Security (JWT)    |            |    
   |   (Login UI)   |          | (Spring Security) |            |    
   +----------------+          +-------------------+            |    
          |                          |                           |    
          +--------------------------------------------------------+    
                                    |                                
                              +------------------+                    
                              | Docker Containers |                    
                              +------------------+                    


L'application communique avec le backend via des API REST sécurisées par **JWT** et est déployée à l'aide de **Docker**.

## Docker Image

```yaml
# Étape 1 : Utiliser une image Java
FROM openjdk:17-jdk-slim

# Étape 2 : Spécifier le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier le fichier .jar dans le conteneur
COPY target/*.jar app.jar

# Étape 4 : Exposer le port sur lequel l'application tourne
EXPOSE 8080

# Étape 5 : Commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]


## Frontend

### Technologies utilisées

- Angular
- Dart

## Backend

### Technologies utilisées

- Spring Boot

## Structure du projet Backend

Le code backend est organisé comme suit :

### 1. **com.example.application**
- Point d'entrée principal : `CalculRpfApplication.java` initialise l'application Spring Boot.

### 2. **com.example.controller**
- Les classes Controller sont responsables du traitement des requêtes HTTP et du retour des réponses.

### 3. **com.example.model**
- Les classes d'entité représentant le modèle de données, annotées avec les annotations JPA pour l'interaction avec la base de données.

### 4. **com.example.repository**
- Interfaces Repository étendant Spring Data JPA.

### Dépendances

1. **Spring Data JPA** - Simplifie l'accès à la base de données via JPA.
2. **MySQL Connector/J** - Pilote JDBC pour la connexion MySQL.
3. **jsonwebtoken** - Il permet l'échange sécurisé de jetons (tokens) entre plusieurs parties.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-api</artifactId>
			<version>0.12.3</version>
</dependency>
```

## Démarrage

### Prérequis :

1. **Git** - Installez [Git](https://git-scm.com/).
2. **XAMPP** - Installez [XAMPP](https://www.apachefriends.org/).
3. **Node Version Manager (NVM)** - Installez depuis [GitHub](https://github.com/nvm-sh/nvm).

### Configuration du backend :

1. Clonez le dépôt :
   ```bash
   git clone [(https://github.com/anwarmoussaoui/calculeRPF)]
   ```

2. Installez les dépendances du backend :
   ```bash
   mvn clean install
   ```

3. Lancez le backend :
   - Démarrez XAMPP (Apache et MySQL).
   - Exécutez l'application Spring Boot : `mvn spring-boot:run`.
   - Accédez au backend à [http://localhost:8081](http://localhost:8081).

### Configuration du frontend - partie web :

1. Clonez le dépôt :
   ```bash
   git clone [(https://github.com/saadkhallouki/frontpolynomial-app)]
   ```

2. Installez Node.js et Angular CLI :
   ```bash
   nvm use 14.11.0
   npm install -g @angular/cli
   ```

3. Installez les dépendances du frontend :
   ```bash
   npm install
   ```

4. Lancez le frontend :
   ```bash
   ng serve
   ```

   - Accédez au frontend à [http://localhost:4200](http://localhost:4200).
     
  ### Configuration du frontend - partie mobile :

1. Clonez le dépôt :
   ```bash
   git clone [(https://github.com/salmaimassadan/Mobile_polynome))]
   ```
2. Lancez le frontend :
   ```bash
   flutter run
   ```

   - Accédez au frontend à [http://localhost:8081](http://localhost:8081).
   

## Vidéo de démonstration

Regardez la vidéo de démonstration de la plateforme ici :  
[Regarder maintenant]([

https://github.com/user-attachments/assets/87ecdd39-6e8a-4305-bcc3-c07877b4936f

])

## Authentification

Pour vous authentifier, utilisez les identifiants suivants :

- **user 1 :**
  - Email : sanaa1@example.com
  - Mot de passe : sanaa
- **user 2 :**
  - Email : salma@example.com
  - Mot de passe : salma

## Contribuer


- Forkez le dépôt.
- Clonez votre dépôt forké.
- Créez une branche pour la fonctionnalité.
- Apportez vos modifications.
- Poussez vos modifications dans votre dépôt forké.
- Soumettez une pull request vers le dépôt principal.

### Contributeurs :
- [IMASSADAN Salma](https://github.com/salmaimassadan)
- [Moussaoui Anwar](https://github.com/anwarmoussaoui)
- [ELGHOUL Sanaa](https://github.com/Elghoulsanaa)
- [KHALLOUKI Saad](https://github.com/saadkhallouki)
- [OUYHIA Youssef](https://github.com/salmaimassadan)
