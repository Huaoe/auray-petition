import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.type === 'payment') {
      const amount = body.data.amount;
      const supporterName = body.data.supporter_name;
      const buyMeACoffeeId = body.data.id;
      
      // Notifier l'admin
      await notifyAdminOfDonation({
        amount,
        supporterName,
        buyMeACoffeeId,
        creditsToAdd: amount * 25 * 0.04, // Calcul des crédits équivalents
        timestamp: new Date().toISOString()
      });
      
      console.log(`🎉 Don reçu: $${amount} de ${supporterName} - ID: ${buyMeACoffeeId}`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Donation processed, admin notified' 
      });
    }
    
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function notifyAdminOfDonation(data: any) {
  // Email, Slack, Discord, etc.
  const message = `
🚨 NOUVEAU DON REÇU 🚨

💰 Montant: $${data.amount}
👤 Donateur: ${data.supporterName}
🆔 ID Buy Me a Coffee: ${data.buyMeACoffeeId}
💎 Crédits à débloquer: $${data.creditsToAdd.toFixed(2)}
⏰ Timestamp: ${data.timestamp}

👉 Action requise:
1. Acheter $${data.creditsToAdd.toFixed(2)} de crédits sur Stability AI
2. Les utilisateurs pourront alors utiliser leurs crédits virtuels
  `;
  
  console.log(message);
  // Implémenter votre notification préférée
}