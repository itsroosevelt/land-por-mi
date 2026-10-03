'use client';

import { useState } from 'react';
import { sendEmailVerification, signOut, type User } from 'firebase/auth';
import { MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

/**
 * Se muestra a quien se registró con correo y contraseña y aún no confirmó su correo.
 * El servidor tampoco entrega datos sin correo verificado (ver backend/auth/portal-user.ts).
 */
export default function VerifyEmailScreen({ user }: { user: User }) {
  const [busy, setBusy] = useState(false);

  const resend = async () => {
    setBusy(true);
    try {
      await sendEmailVerification(user, { url: `${window.location.origin}/portal` });
      toast.success('Te enviamos un nuevo correo de verificación.');
    } catch {
      toast.error('Espera unos minutos antes de pedir otro correo.');
    } finally {
      setBusy(false);
    }
  };

  const checkVerified = async () => {
    setBusy(true);
    try {
      await user.reload();
      if (auth.currentUser?.emailVerified) {
        await auth.currentUser.getIdToken(true); // token nuevo con el correo verificado
        window.location.reload();
        return;
      }
      toast.error('Todavía no aparece verificado. Revisa tu bandeja de entrada o la carpeta de spam.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <MailCheck className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-slate-900">Verifica tu correo</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Para proteger tu información, confirma que <strong className="text-slate-800">{user.email}</strong> es
            tuyo. Te enviamos un enlace de verificación; ábrelo y luego vuelve aquí.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={checkVerified}
            disabled={busy}
            className="h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60"
          >
            Ya verifiqué mi correo
          </button>
          <button
            type="button"
            onClick={resend}
            disabled={busy}
            className="h-11 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
          >
            Reenviar correo de verificación
          </button>
          <button
            type="button"
            onClick={() => signOut(auth).then(() => (window.location.href = '/login'))}
            className="text-xs text-slate-400 hover:text-slate-700 pt-2"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
