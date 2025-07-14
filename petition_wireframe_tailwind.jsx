import React from "react";

export default function PetitionPage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">Pétition Citoyenne</h1>
        <nav className="space-x-4 text-sm">
          <a href="#context" className="hover:text-green-700">Contexte</a>
          <a href="#sign" className="hover:text-green-700">Signer</a>
          <a href="#contact" className="hover:text-green-700">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-4 bg-green-50">
        <h2 className="text-3xl font-bold mb-4">Pour une Régulation des Sonneries de Cloches à Auray</h2>
        <p className="max-w-xl mx-auto mb-6 text-gray-600">
          Ensemble, trouvons un équilibre entre tradition religieuse et qualité de vie. Votre signature compte pour ouvrir le dialogue.
        </p>
        <button className="bg-green-700 text-white px-6 py-3 rounded-full shadow hover:bg-green-800">
          Signer la Pétition Maintenant
        </button>
      </section>

      {/* Objectifs Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-8 text-center">Nos Objectifs</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h4 className="font-bold mb-2">Limitation nocturne</h4>
            <p>22h - 8h</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h4 className="font-bold mb-2">Réduction de l’intensité sonore</h4>
            <p>À 2 minutes</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h4 className="font-bold mb-2">Dialogue municipal</h4>
            <p>Concertation et solutions équilibrées</p>
          </div>
        </div>
      </section>

      {/* Formulaire Section */}
      <section id="sign" className="py-12 px-4 bg-gray-100">
        <h3 className="text-2xl font-bold mb-8 text-center">Signer la Pétition</h3>
        <form className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow space-y-4">
          <div>
            <label className="block mb-1 font-medium">Prénom</label>
            <input type="text" className="w-full border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Nom</label>
            <input type="text" className="w-full border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" className="w-full border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ville</label>
            <input type="text" className="w-full border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Code postal</label>
            <input type="text" className="w-full border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Commentaire (optionnel)</label>
            <textarea className="w-full border-gray-300 rounded p-2"></textarea>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <p className="text-sm">J’accepte la politique de confidentialité.</p>
          </div>
          <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-full shadow hover:bg-green-800">
            Signer la Pétition
          </button>
        </form>
      </section>

      {/* Contexte Section */}
      <section id="context" className="py-12 px-4 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Comprendre le Contexte</h3>
        <p className="text-gray-600 mb-6">
          Les sonneries quotidiennes de l’église Saint-Gildas impactent significativement la qualité de vie des résidents, particulièrement ceux vivant à proximité immédiate du centre-ville.
        </p>
      </section>

      {/* Proposition Section */}
      <section className="py-12 px-4 bg-green-50">
        <h3 className="text-2xl font-bold mb-4 text-center">Notre Proposition</h3>
        <p className="max-w-xl mx-auto text-center text-gray-600 mb-6">
          Établir un dialogue constructif pour définir des créneaux horaires respectueux, préservant à la fois la tradition religieuse et la tranquillité publique.
        </p>
        <div className="text-center">
          <button className="text-green-700 font-medium underline">En savoir plus</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 bg-gray-800 text-gray-300 text-center" id="contact">
        <p>© 2025 Pétition Citoyenne Auray. Mentions légales | Politique de confidentialité</p>
      </footer>
    </div>
  );
}

// 💡 Ce wireframe est prêt pour intégration finale (optimisation SEO, validation RGPD, connexion back-end petitions). Dis-moi si tu souhaites sa version Next.js ou la connection Airtable / Supabase pour tes signatures en temps réel.
