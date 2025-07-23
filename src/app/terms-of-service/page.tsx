import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="bg-white py-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Conditions d&apos;Utilisation</h1>
          <p className="mt-2 text-lg text-gray-600">(Terms of Service)</p>
        </div>

        <div className="prose prose-lg mx-auto text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-blue-800">
              Ces conditions d&apos;utilisation incluent des dispositions spécifiques concernant l&apos;utilisation des API et services 
              de Meta (Facebook et Instagram) et autres plateformes de réseaux sociaux.
            </p>
            <p className="text-sm text-blue-800 mt-2">
              (These terms of service include specific provisions regarding the use of Meta (Facebook and Instagram) 
              APIs and services and other social media platforms.)
            </p>
          </div>

          <h2 className="font-semibold text-2xl mt-8">1. Acceptation des conditions</h2>
          <p>
            En accédant à notre application de transformation d&apos;églises et de partage sur les réseaux sociaux, vous acceptez 
            d&apos;être lié par ces conditions d&apos;utilisation, notre politique de confidentialité, et toutes les lois et réglementations 
            applicables. Si vous n&apos;acceptez pas ces conditions, vous n&apos;êtes pas autorisé à utiliser notre application.
          </p>
          <p>
            (By accessing our church transformation and social media sharing application, you agree to be bound by these terms of service, 
            our privacy policy, and all applicable laws and regulations. If you do not agree to these terms, you are not authorized to use our application.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">2. Description du service</h2>
          <p>
            Notre application permet aux utilisateurs de :
          </p>
          <ul>
            <li>Signer une pétition pour la transformation des églises</li>
            <li>Créer des transformations visuelles d&apos;églises</li>
            <li>Partager ces transformations sur les réseaux sociaux (Facebook, Instagram, Twitter, LinkedIn)</li>
          </ul>
          <p>
            (Our application allows users to: Sign a petition for church transformation, Create visual transformations of churches, 
            Share these transformations on social media (Facebook, Instagram, Twitter, LinkedIn).)
          </p>

          <h2 className="font-semibold text-2xl mt-8">3. Compte utilisateur et connexion aux réseaux sociaux</h2>
          <p>
            Pour utiliser certaines fonctionnalités de notre application, vous devrez vous connecter via vos comptes de réseaux sociaux. 
            En vous connectant via ces plateformes, vous nous autorisez à accéder à certaines informations de votre compte et à publier 
            du contenu en votre nom, conformément aux autorisations que vous accordez.
          </p>
          <p>
            Vous êtes responsable de :
          </p>
          <ul>
            <li>Maintenir la confidentialité de vos informations de connexion</li>
            <li>Toutes les activités qui se produisent sous votre compte</li>
            <li>Vous déconnecter de votre compte à la fin de chaque session</li>
          </ul>
          <p>
            Vous pouvez révoquer l&apos;accès à vos comptes de réseaux sociaux à tout moment en suivant les instructions dans notre 
            politique de confidentialité.
          </p>
          <p>
            (To use certain features of our application, you will need to connect via your social media accounts. 
            By connecting through these platforms, you authorize us to access certain information from your account and publish content 
            on your behalf, in accordance with the permissions you grant. You are responsible for maintaining the confidentiality of your 
            login information, all activities that occur under your account, and logging out of your account at the end of each session. 
            You can revoke access to your social media accounts at any time by following the instructions in our privacy policy.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">4. Règles de conduite</h2>
          <p>
            En utilisant notre application, vous acceptez de ne pas :
          </p>
          <ul>
            <li>Utiliser notre service à des fins illégales ou non autorisées</li>
            <li>Violer les lois, règles ou réglementations applicables</li>
            <li>Interférer avec ou perturber l&apos;intégrité ou les performances de notre application</li>
            <li>Tenter d&apos;accéder à des comptes, systèmes ou réseaux sans autorisation</li>
            <li>Publier du contenu diffamatoire, obscène, menaçant, harcelant ou autrement répréhensible</li>
            <li>Utiliser notre application pour envoyer des communications non sollicitées</li>
            <li>Usurper l&apos;identité d&apos;une autre personne ou entité</li>
          </ul>
          <p>
            (By using our application, you agree not to: Use our service for illegal or unauthorized purposes, Violate applicable laws, 
            rules, or regulations, Interfere with or disrupt the integrity or performance of our application, Attempt to access accounts, 
            systems, or networks without authorization, Post defamatory, obscene, threatening, harassing, or otherwise objectionable content, 
            Use our application to send unsolicited communications, Impersonate another person or entity.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">5. Contenu généré par l&apos;utilisateur</h2>
          <p>
            Lorsque vous créez des transformations d&apos;églises ou partagez du contenu via notre application, vous conservez tous les 
            droits de propriété intellectuelle sur ce contenu, mais vous nous accordez une licence mondiale, non exclusive, libre de 
            redevance pour utiliser, reproduire, adapter, publier, traduire et distribuer ce contenu dans le cadre de notre service.
          </p>
          <p>
            Vous déclarez et garantissez que :
          </p>
          <ul>
            <li>Vous possédez ou avez les droits nécessaires pour partager le contenu que vous publiez</li>
            <li>Le contenu ne viole pas les droits de tiers, y compris les droits de propriété intellectuelle</li>
            <li>Le contenu ne contient pas de matériel diffamatoire, obscène, offensant, haineux ou autrement illégal</li>
          </ul>
          <p>
            (When you create church transformations or share content through our application, you retain all intellectual property rights 
            to that content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, 
            and distribute that content in connection with our service. You represent and warrant that: You own or have the necessary rights 
            to share the content you post, The content does not infringe on the rights of third parties, including intellectual property rights, 
            The content does not contain defamatory, obscene, offensive, hateful, or otherwise illegal material.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">6. Dispositions spécifiques aux plateformes Meta (Facebook et Instagram)</h2>
          <p>
            Lorsque vous utilisez notre application pour partager du contenu sur Facebook ou Instagram :
          </p>
          <ul>
            <li>
              Vous nous autorisez à publier du contenu sur vos comptes Facebook et/ou Instagram en votre nom, 
              conformément aux autorisations que vous accordez lors de la connexion.
            </li>
            <li>
              Vous reconnaissez que votre utilisation des API Meta est également soumise aux conditions d&apos;utilisation de Meta, 
              y compris la Politique d&apos;utilisation des données et les Conditions de service de Facebook et Instagram.
            </li>
            <li>
              Vous comprenez que vous pouvez révoquer l&apos;accès à vos comptes Meta à tout moment en suivant les instructions 
              dans notre politique de confidentialité ou directement via les paramètres de votre compte Facebook ou Instagram.
            </li>
            <li>
              Vous acceptez de ne pas utiliser notre application pour publier du contenu qui viole les conditions d&apos;utilisation 
              de Facebook ou Instagram.
            </li>
          </ul>
          <p>
            (When you use our application to share content on Facebook or Instagram: You authorize us to publish content on your 
            Facebook and/or Instagram accounts on your behalf, in accordance with the permissions you grant during connection. 
            You acknowledge that your use of the Meta APIs is also subject to Meta&apos;s terms of use, including Facebook and Instagram&apos;s 
            Data Policy and Terms of Service. You understand that you can revoke access to your Meta accounts at any time by following 
            the instructions in our privacy policy or directly through your Facebook or Instagram account settings. 
            You agree not to use our application to post content that violates Facebook or Instagram&apos;s terms of use.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">7. Limitation de responsabilité</h2>
          <p>
            Notre application est fournie "telle quelle" et "selon disponibilité", sans garantie d&apos;aucune sorte, expresse ou implicite. 
            Nous ne garantissons pas que notre service sera ininterrompu, opportun, sécurisé ou sans erreur.
          </p>
          <p>
            Dans toute la mesure permise par la loi, nous ne serons pas responsables des dommages indirects, accessoires, spéciaux, 
            consécutifs ou punitifs, ou de toute perte de profits ou de revenus, que ces dommages soient prévisibles ou non, 
            et même si nous avons été informés de la possibilité de tels dommages.
          </p>
          <p>
            (Our application is provided "as is" and "as available", without warranty of any kind, express or implied. 
            We do not guarantee that our service will be uninterrupted, timely, secure, or error-free. To the fullest extent permitted by law, 
            we will not be liable for indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
            whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">8. Indemnisation</h2>
          <p>
            Vous acceptez de défendre, indemniser et de dégager de toute responsabilité notre équipe, nos partenaires et concédants 
            de licence contre toute réclamation, responsabilité, dommage, perte et dépense, y compris les frais juridiques et comptables 
            raisonnables, découlant de ou liés de quelque manière que ce soit à votre accès ou utilisation de notre application, 
            à votre violation de ces conditions, ou à votre violation des droits d&apos;un tiers.
          </p>
          <p>
            (You agree to defend, indemnify, and hold harmless our team, partners, and licensors from and against any claims, liabilities, 
            damages, losses, and expenses, including reasonable legal and accounting fees, arising out of or in any way connected with 
            your access to or use of our application, your violation of these terms, or your violation of any third-party rights.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">9. Modifications des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions d&apos;utilisation à tout moment. Les modifications prendront effet 
            dès leur publication sur notre application. Votre utilisation continue de notre application après la publication des 
            modifications constitue votre acceptation des nouvelles conditions.
          </p>
          <p>
            (We reserve the right to modify these terms of service at any time. The modifications will take effect as soon as they are 
            published on our application. Your continued use of our application after the posting of modifications constitutes your 
            acceptance of the new terms.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">10. Résiliation</h2>
          <p>
            Nous nous réservons le droit de résilier ou de suspendre votre accès à notre application, sans préavis ni responsabilité, 
            pour quelque raison que ce soit, y compris, sans limitation, si vous enfreignez ces conditions d&apos;utilisation.
          </p>
          <p>
            Vous pouvez également mettre fin à votre utilisation de notre application en supprimant vos données conformément aux 
            instructions dans notre politique de confidentialité.
          </p>
          <p>
            (We reserve the right to terminate or suspend your access to our application, without notice or liability, for any reason, 
            including, without limitation, if you breach these terms of service. You may also terminate your use of our application 
            by deleting your data in accordance with the instructions in our privacy policy.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">11. Loi applicable</h2>
          <p>
            Ces conditions d&apos;utilisation sont régies et interprétées conformément aux lois françaises, sans égard aux principes de 
            conflits de lois. Tout litige découlant de ou lié à ces conditions sera soumis à la compétence exclusive des tribunaux français.
          </p>
          <p>
            (These terms of service are governed by and construed in accordance with French law, without regard to its conflict of law principles. 
            Any dispute arising out of or related to these terms will be subject to the exclusive jurisdiction of the French courts.)
          </p>

          <h2 className="font-semibold text-2xl mt-8">12. Contact</h2>
          <p>
            Si vous avez des questions concernant ces conditions d&apos;utilisation, veuillez nous contacter à :
          </p>
          <p>
            <strong>E-mail :</strong> auray.petition@gmail.com
          </p>
          <p>
            (If you have any questions about these terms of service, please contact us at: auray.petition@gmail.com)
          </p>

          <div className="mt-8 flex justify-between items-center">
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Politique de Confidentialité (Privacy Policy)
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