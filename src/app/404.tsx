// src/app/404.tsx
export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
        <p className="text-lg">La page demandée n'existe pas.</p>
      </div>
    );
  }