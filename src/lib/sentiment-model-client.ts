"use client";

/**
 * Version client (mock) du modèle DistilBERT pour les tests
 * Implémente la même API que la version serveur mais avec des simulations côté client
 */

// Interface pour le classificateur de toxicité (identique à la version serveur)
export interface ToxicityClassifier {
  load(): Promise<void>;
  classify(text: string): Promise<{
    toxic?: number;
    severe_toxic?: number;
    obscene?: number;
    threat?: number;
    insult?: number;
    identity_hate?: number;
  }>;
}

// Classe d'implémentation client-side du classificateur de toxicité
class ClientToxicityClassifier implements ToxicityClassifier {
  private modelLoaded: boolean = false;
  private isLoading: boolean = false;
  
  async load(): Promise<void> {
    if (this.modelLoaded || this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Simuler le chargement du modèle côté client
      console.log("Simulation client du chargement du modèle DistilBERT...");
      
      // Délai artificiel pour simuler le chargement
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.modelLoaded = true;
      console.log("Modèle DistilBERT client simulé avec succès");
    } catch (error) {
      console.error("Erreur lors de la simulation du modèle DistilBERT:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
  
  async classify(text: string): Promise<{
    toxic?: number;
    severe_toxic?: number;
    obscene?: number;
    threat?: number;
    insult?: number;
    identity_hate?: number;
  }> {
    if (!this.modelLoaded) {
      await this.load();
    }
    
    try {
      // Simuler la prédiction du modèle avec un algorithme simple
      const lowerText = text.toLowerCase();
      
      // Mots positifs et négatifs pour simuler l'analyse
      const positiveWords = ['bon', 'super', 'bien', 'génial', 'excellent', 'formidable', 'top', 'bravo', 'merci', 'content'];
      const negativeWords = ['mauvais', 'nul', 'horrible', 'terrible', 'pire', 'déteste', 'pourri', 'déçu', 'moche', 'mal'];
      const toxicWords = ['merde', 'putain', 'con', 'connard', 'salaud', 'débile', 'idiot'];
      const severeToxicWords = ['encule', 'pute', 'salope', 'connasse', 'pd', 'enculé'];
      
      // Calculer le score basé sur la présence de mots
      const positiveScore = this.calculateScore(lowerText, positiveWords);
      const negativeScore = this.calculateScore(lowerText, negativeWords);
      const toxicScore = this.calculateScore(lowerText, toxicWords);
      const severeScore = this.calculateScore(lowerText, severeToxicWords);
      
      // Plus le score positif est élevé, moins le texte est toxique
      const toxic = Math.max(0, Math.min(1, 1 - positiveScore * 1.5 + negativeScore + toxicScore * 2));
      const severe_toxic = severeScore;
      
      // Dérivations simplifiées
      const obscene = (toxic + severe_toxic) / 2;
      const threat = Math.min(toxic * 0.3, 0.8);
      const insult = Math.max(toxic * 0.8, severe_toxic * 0.7);
      const identity_hate = severe_toxic * 0.4;
      
      return {
        toxic,
        severe_toxic,
        obscene,
        threat,
        insult,
        identity_hate
      };
    } catch (error) {
      console.error("Erreur lors de la classification client du texte:", error);
      throw error;
    }
  }
  
  private calculateScore(text: string, wordList: string[]): number {
    const words = text.split(/\s+/);
    let count = 0;
    
    wordList.forEach(word => {
      if (text.includes(word)) count++;
    });
    
    const score = Math.min(count / Math.max(words.length / 5, 1), 1);
    return score;
  }
}

// Cache du modèle singleton
let clientToxicityModel: ToxicityClassifier | null = null;

// Fonction pour obtenir une instance du modèle client
export function getToxicityClassifier(): ToxicityClassifier {
  if (!clientToxicityModel) {
    clientToxicityModel = new ClientToxicityClassifier();
  }
  return clientToxicityModel;
}

// Fonction utilitaire pour extraire des mots-clés
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const stopWords = [
    'le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'mais', 'donc', 
    'de', 'du', 'ce', 'cette', 'ces', 'mon', 'ma', 'mes', 'ton', 'ta', 
    'tes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'pour', 'par',
    'que', 'qui', 'quoi', 'dont', 'où', 'comment', 'pourquoi', 'quand',
    'pas', 'plus', 'moins', 'très', 'trop', 'peu', 'assez', 'avec', 'sans'
  ];
  
  return text.toLowerCase()
    .replace(/[.,;:!?'"()\/\-_]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 15);
}
