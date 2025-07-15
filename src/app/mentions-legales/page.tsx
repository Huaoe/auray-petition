export default function MentionsLegalesPage() {
  return (
    <div className="bg-white py-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Mentions Légales</h1>
        </div>

        <div className="prose prose-lg mx-auto text-gray-700">
          <p>
            Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site les présentes mentions légales.
          </p>

          <h2 className="font-semibold text-2xl mt-8">1. Éditeur du site</h2>
          <p>
            Le site est édité par 
            <br />
            <strong>Adresse e-mail :</strong> auray.petition@gmail.com
            <br />
            <strong>Directeur de la publication :</strong> Thomas Berrod
          </p>

          <h2 className="font-semibold text-2xl mt-8">2. Hébergeur du site</h2>
          <p>
            L'hébergement du site est assuré par la société Vercel Inc.
            <br />
            <strong>Siège social :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            <br />
            <strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com</a>
          </p>

          <h2 className="font-semibold text-2xl mt-8">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
          <p>
            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>

          <h2 className="font-semibold text-2xl mt-8">4. Données personnelles (RGPD)</h2>
          <p>
            Les informations recueillies via le formulaire de signature (prénom, nom, adresse e-mail, ville, code postal) sont enregistrées dans un fichier informatisé (Google Sheets) par le responsable du traitement pour la gestion de la pétition.
          </p>
          <p>
            La base légale du traitement est le consentement (Article 6.1.a du RGPD). Les données sont conservées pendant la durée de la pétition et une année supplémentaire. Elles sont destinées uniquement à l'équipe organisatrice de la pétition et ne seront jamais cédées à des tiers.
          </p>
          <p>
            Conformément à la loi « informatique et libertés » et au RGPD, vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier ou supprimer en contactant : auray.petition@gmail.com.
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Dernière mise à jour : 15 juillet 2025
          </p>
        </div>
      </main>
    </div>
  );
}
