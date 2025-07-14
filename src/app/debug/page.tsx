'use client'

export default function DebugPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '32px', marginBottom: '20px' }}>🔧 DEBUG PAGE</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: 'blue' }}>Test Styles Inline</h2>
        <p>Si vous voyez cette page avec des couleurs, les styles inline fonctionnent.</p>
      </div>

      <div className="bg-green-500 p-4 rounded-lg mb-4">
        <h2 className="text-white text-xl">Test Tailwind</h2>
        <p className="text-green-100">Si ce bloc est vert, Tailwind fonctionne.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <span className="text-blue-800 font-bold">Tailwind Grid 1</span>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <span className="text-purple-800 font-bold">Tailwind Grid 2</span>
        </div>
      </div>

      <button 
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        // Erreur : Les gestionnaires d’événements (onClick) ne peuvent pas être passés directement aux props d’un composant Server.
        // Pour activer l’interactivité, rendez ce composant « use client » et gérez onClick côté client.
      >
        Test Button
      </button>
    </div>
  )
}
