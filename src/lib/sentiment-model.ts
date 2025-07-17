/**
 * Modèle DistilBERT multilingue pour classification de toxicité
 * Basé sur https://github.com/gravitee-io-labs/gravitee-distilbert-multilingual-toxicity-classifier
 */

// Interface pour le classificateur de toxicité
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

// Cache du modèle singleton
let toxicityModel: ToxicityClassifier | null = null;

// Classe d'implémentation du classificateur de toxicité
class GraviteeDistilBERTClassifier implements ToxicityClassifier {
  private model: any = null;
  private modelLoaded: boolean = false;
  private isLoading: boolean = false;
  
  async load(): Promise<void> {
    if (this.modelLoaded || this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Simuler le chargement du modèle (à remplacer par le vrai chargement)
      // En production, vous utiliserez ONNX Runtime Web ou TensorFlow.js
      console.log("Chargement du modèle DistilBERT multilingue pour classification de toxicité...");
      
      // Charger le modèle depuis un CDN ou des fichiers locaux
      // Exemple: this.model = await tf.loadLayersModel('path/to/model.json');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulation
      
      this.modelLoaded = true;
      console.log("Modèle DistilBERT chargé avec succès!");
    } catch (error) {
      console.error("Erreur lors du chargement du modèle DistilBERT:", error);
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
      // Simuler la prédiction du modèle (à remplacer par la vraie inférence)
      // En production: const prediction = await this.model.predict(preprocessText(text));
      
      // Algorithme temporaire basé sur des heuristiques simples
      // À remplacer par la vraie inférence du modèle
      const lowerText = text.toLowerCase();
      
      // Recherche de mots toxiques courants pour simuler le comportement du modèle
      const toxicWords = ['colère', 'merde', 'putain', 'con', 'connard', 'salaud', 'débile', 'idiot'];
      const severeToxicWords = ['encule', 'pute', 'salope', 'connasse', 'pd', 'enculé'];
      const threatWords = ['tuer', 'frapper', 'détruire', 'éliminer', 'mort', 'mourir'];
      
      // Calculer des scores approximatifs basés sur la présence de mots
      const toxic = this.calculateScore(lowerText, toxicWords);
      const severe_toxic = this.calculateScore(lowerText, severeToxicWords) * 1.5;
      const obscene = (toxic + severe_toxic) / 2;
      const threat = this.calculateScore(lowerText, threatWords);
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
      console.error("Erreur lors de la classification du texte:", error);
      throw error;
    }
  }
  
  private calculateScore(text: string, wordList: string[]): number {
    const words = text.split(/\s+/);
    let count = 0;
    
    wordList.forEach(toxicWord => {
      if (text.includes(toxicWord)) count++;
    });
    
    const score = Math.min(count / Math.max(words.length / 5, 1), 1);
    return score;
  }
}

// Fonction pour obtenir une instance du modèle (lazy loading)
export function getToxicityClassifier(): ToxicityClassifier {
  if (!toxicityModel) {
    toxicityModel = new GraviteeDistilBERTClassifier();
  }
  return toxicityModel;
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
