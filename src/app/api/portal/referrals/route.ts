import { requirePortalAccess } from '@/backend/auth/portal-user';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin no está inicializado' }, { status: 500 });
    }

    const body = await req.json();
    const {
      referralName,
      referralPhone,
      referralEmail,
      visaType,
      referrerId,
      referrerName,
      referrerEmail,
    } = body;

    if (!referralName || !referralPhone) {
      return NextResponse.json({ error: 'El nombre y teléfono del referido son requeridos' }, { status: 400 });
    }
    const denied = await requirePortalAccess(req, referrerEmail);
    if (denied) return denied;

    const now = new Date().toISOString();
    const docRef = db.collection('referrals').doc();

    const referralData = {
      id: docRef.id,
      referralName: String(referralName).trim(),
      referralPhone: String(referralPhone).trim(),
      referralEmail: referralEmail ? String(referralEmail).trim().toLowerCase() : '',
      visaType: visaType === 'B-2' ? 'B-2' : 'F-1',
      referrerId: referrerId ? String(referrerId).trim() : '',
      referrerName: referrerName ? String(referrerName).trim() : 'Cliente Registrado',
      referrerEmail: referrerEmail ? String(referrerEmail).trim().toLowerCase() : '',
      status: 'pendiente', // 'pendiente' | 'contactado' | 'proceso_iniciado' | 'pagado' | 'descartado'
      rewardPaid: false,
      rewardAmount: 50,
      notes: '',
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(referralData);

    return NextResponse.json({ success: true, referral: referralData });
  } catch (error: any) {
    console.error('Error saving referral:', error);
    return NextResponse.json({ error: error?.message || 'Error al registrar el referido' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ referrals: [] });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('email');

    if (!userId && !userEmail) {
      return NextResponse.json({ referrals: [] });
    }
    // Se filtra siempre por el correo de la sesión (no por un userId arbitrario).
    const denied = await requirePortalAccess(req, userEmail || '__requiere_email__');
    if (denied) return denied;

    let query: FirebaseFirestore.Query = db.collection('referrals');

    if (userEmail) {
      query = query.where('referrerEmail', '==', userEmail.toLowerCase().trim());
    } else if (userId) {
      query = query.where('referrerId', '==', userId);
    }

    const snap = await query.get();
    const referrals: any[] = [];
    snap.forEach((doc) => {
      referrals.push({ id: doc.id, ...doc.data() });
    });

    // Sort by createdAt desc
    referrals.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json({ referrals });
  } catch (error: any) {
    console.error('Error fetching client referrals:', error);
    return NextResponse.json({ referrals: [] });
  }
}
