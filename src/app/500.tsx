// src/app/500.tsx
export default function ServerError() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold mb-4">500 - Erreur serveur</h1>
        <p className="text-lg">Une erreur interne est survenue.</p>
      </div>
    );
  }