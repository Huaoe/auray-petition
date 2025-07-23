import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Politique de Confidentialité</h1>
          <p className="mt-2 text-lg text-gray-600">(Privacy Policy)</p>
        </div>

        <div className="prose prose-lg mx-auto text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-blue-800">
              Cette politique de confidentialité est spécifiquement conçue pour répondre aux exigences de Meta (Facebook et Instagram) 
              concernant l&apos;utilisation de leurs API et services.
            </p>
            <p className="text-sm text-blue-800 mt-2">
              (This privacy policy is specifically designed to meet Meta&apos;s (Facebook and Instagram) requirements 
              regarding the use of their APIs and services.)
            </p>
          </div>

          <h2 className="font-semibold text-2xl mt-8">1. Introduction</h2>
          <p>
            La présente Politique de confidentialité décrit comment nous collectons, utilisons et partageons vos informations 
            personnelles lorsque vous utilisez notre application de transformation d&apos;églises et de partage sur les réseaux sociaux.
          </p>
          <p>
            (This Privacy Policy describes how we collect, use, and share your personal information when you use our church 
            transformation and social media sharing application.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">2. Informations que nous collectons</h2>
          <p>
            Nous collectons les types d&apos;informations suivants :
          </p>
          <ul>
            <li>
              <strong>Informations de compte :</strong> Prénom, nom, adresse e-mail, ville, code postal lorsque vous signez notre pétition.
            </li>
            <li>
              <strong>Informations des réseaux sociaux :</strong> Lorsque vous vous connectez via Facebook, Instagram, Twitter ou LinkedIn, 
              nous recevons des informations de base sur votre profil et un jeton d&apos;accès qui nous permet de publier du contenu en votre nom.
            </li>
            <li>
              <strong>Contenu généré :</strong> Les images transformées que vous créez et les messages que vous souhaitez partager.
            </li>
            <li>
              <strong>Données d&apos;utilisation :</strong> Informations sur la façon dont vous utilisez notre application.
            </li>
          </ul>
          <p>
            (We collect the following types of information: Account Information (name, email, city, postal code), Social Media Information 
            (when you connect via Facebook, Instagram, Twitter or LinkedIn), Generated Content (transformed images and messages), 
            and Usage Data.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">3. Comment nous utilisons vos informations</h2>
          <p>
            Nous utilisons vos informations pour :
          </p>
          <ul>
            <li>Gérer votre compte et la pétition</li>
            <li>Vous permettre de créer et partager des transformations d&apos;églises</li>
            <li>Publier du contenu sur vos comptes de réseaux sociaux avec votre autorisation explicite</li>
            <li>Améliorer notre application et ses fonctionnalités</li>
            <li>Communiquer avec vous concernant la pétition et l&apos;application</li>
          </ul>
          <p>
            (We use your information to: Manage your account and the petition, Allow you to create and share church transformations, 
            Publish content on your social media accounts with your explicit permission, Improve our application and its features, 
            Communicate with you regarding the petition and the application.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">4. Partage de vos informations</h2>
          <p>
            Nous partageons vos informations avec :
          </p>
          <ul>
            <li>
              <strong>Meta (Facebook et Instagram) :</strong> Lorsque vous choisissez de partager du contenu sur Facebook ou Instagram, 
              nous transmettons ce contenu à Meta via leurs API. Nous n&apos;utilisons vos jetons d&apos;accès que pour les finalités que vous avez 
              autorisées (publication de contenu).
            </li>
            <li>
              <strong>Twitter :</strong> Lorsque vous choisissez de partager du contenu sur Twitter.
            </li>
            <li>
              <strong>LinkedIn :</strong> Lorsque vous choisissez de partager du contenu sur LinkedIn.
            </li>
            <li>
              <strong>Prestataires de services :</strong> Nous utilisons Google Sheets pour stocker les signatures de pétition et les 
              informations de connexion aux réseaux sociaux, et Vercel pour l&apos;hébergement de notre application.
            </li>
          </ul>
          <p>
            Nous ne vendons jamais vos données personnelles à des tiers.
          </p>
          <p>
            (We share your information with: Meta (Facebook and Instagram) when you choose to share content, Twitter, LinkedIn, 
            and service providers like Google Sheets and Vercel. We never sell your personal data to third parties.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">5. Données Meta (Facebook et Instagram)</h2>
          <p>
            Lorsque vous vous connectez via Facebook ou Instagram, nous recevons :
          </p>
          <ul>
            <li>Un jeton d&apos;accès pour publier du contenu en votre nom</li>
            <li>Informations de base sur votre profil (nom, identifiant)</li>
          </ul>
          <p>
            Nous n&apos;utilisons ces données que pour :
          </p>
          <ul>
            <li>Vous permettre de partager vos transformations d&apos;églises sur vos comptes</li>
            <li>Associer vos publications à votre compte dans notre application</li>
          </ul>
          <p>
            Nous ne collectons pas d&apos;autres données de votre profil Meta, de vos amis, ou de votre fil d&apos;actualité.
          </p>
          <p>
            (When you connect via Facebook or Instagram, we receive an access token and basic profile information. 
            We only use this data to allow you to share your church transformations and to associate your publications with your account. 
            We do not collect other data from your Meta profile, your friends, or your news feed.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">6. Conservation des données</h2>
          <p>
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services ou pour d&apos;autres finalités 
            essentielles telles que le respect de nos obligations légales.
          </p>
          <ul>
            <li>
              <strong>Données de pétition :</strong> Conservées pendant la durée de la pétition et une année supplémentaire.
            </li>
            <li>
              <strong>Jetons d&apos;accès aux réseaux sociaux :</strong> Conservés jusqu&apos;à ce que vous vous déconnectiez ou révoquiez l&apos;accès.
            </li>
            <li>
              <strong>Contenu généré :</strong> Conservé aussi longtemps que vous maintenez votre compte.
            </li>
          </ul>
          <p>
            (We retain your personal data as long as necessary to provide our services or for other essential purposes such as 
            complying with our legal obligations. Petition data is kept for the duration of the petition plus one year. 
            Social media access tokens are kept until you disconnect or revoke access. Generated content is kept as long as you maintain your account.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">7. Vos droits et choix</h2>
          <p>
            Vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul>
            <li>Accéder à vos données personnelles</li>
            <li>Rectifier vos données personnelles</li>
            <li>Supprimer vos données personnelles</li>
            <li>Retirer votre consentement à tout moment</li>
            <li>Vous opposer au traitement de vos données personnelles</li>
            <li>Exporter vos données personnelles (portabilité)</li>
          </ul>
          <p>
            Pour exercer ces droits, veuillez nous contacter à auray.petition@gmail.com.
          </p>
          <p>
            (You have the following rights regarding your personal data: Access, Rectification, Deletion, Withdrawal of consent, 
            Opposition to processing, and Data portability. To exercise these rights, please contact us at auray.petition@gmail.com.)
          </p>

          <h2 className="font-semibold text-2xl mt-8" id="data-deletion">8. Suppression de vos données</h2>
          <p>
            Vous pouvez demander la suppression de vos données personnelles à tout moment en envoyant un e-mail à auray.petition@gmail.com 
            avec pour objet "Demande de suppression de données". Veuillez inclure l&apos;adresse e-mail associée à votre compte.
          </p>
          <p>
            Pour révoquer l&apos;accès à vos comptes de réseaux sociaux :
          </p>
          <ul>
            <li>
              <strong>Facebook/Instagram :</strong> Visitez les paramètres de votre compte Facebook/Instagram, 
              allez dans Paramètres &gt; Applications et sites web &gt; Trouvez notre application &gt; Supprimez-la.
            </li>
            <li>
              <strong>Twitter :</strong> Visitez les paramètres de votre compte Twitter, 
              allez dans Paramètres et confidentialité &gt; Sécurité et accès au compte &gt; Applications et sessions &gt; 
              Trouvez notre application &gt; Révoquez l&apos;accès.
            </li>
            <li>
              <strong>LinkedIn :</strong> Visitez les paramètres de votre compte LinkedIn, 
              allez dans Données de compte &gt; Applications autorisées &gt; Trouvez notre application &gt; Supprimez.
            </li>
          </ul>
          <p>
            Nous traiterons votre demande dans un délai de 30 jours et vous confirmerons la suppression de vos données.
          </p>
          <p>
            (You can request the deletion of your personal data at any time by sending an email to auray.petition@gmail.com 
            with the subject "Data Deletion Request". Please include the email address associated with your account. 
            To revoke access to your social media accounts, visit your account settings on each platform. 
            We will process your request within 30 days and confirm the deletion of your data.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">9. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, 
            modification, divulgation ou destruction non autorisés. Ces mesures comprennent le chiffrement des données sensibles, 
            l&apos;accès limité aux données personnelles, et des audits réguliers de nos pratiques.
          </p>
          <p>
            (We implement appropriate security measures to protect your personal data against unauthorized access, modification, 
            disclosure, or destruction. These measures include encryption of sensitive data, limited access to personal data, 
            and regular audits of our practices.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">10. Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement 
            important par e-mail ou par une notification sur notre application. Nous vous encourageons à consulter régulièrement 
            cette politique pour rester informé de la façon dont nous protégeons vos informations.
          </p>
          <p>
            (We may update this privacy policy from time to time. We will notify you of any significant changes by email or 
            through a notification on our application. We encourage you to review this policy regularly to stay informed about 
            how we protect your information.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">11. Contact</h2>
          <p>
            Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, 
            veuillez nous contacter à :
          </p>
          <p>
            <strong>E-mail :</strong> auray.petition@gmail.com
          </p>
          <p>
            (If you have any questions about this privacy policy or our data protection practices, please contact us at: auray.petition@gmail.com)
          </p>

          <div className="mt-8 flex justify-between items-center">
            <Link href="/terms-of-service" className="text-blue-600 hover:underline">
              Conditions d&apos;utilisation (Terms of Service)
            </Link>
            <Link href="/mentions-legales" className="text-blue-600 hover:underline">
              Mentions Légales (Legal Notices)
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Dernière mise à jour : 22 juillet 2025
          </p>
        </div>
      </main>
    </div>
  );
}