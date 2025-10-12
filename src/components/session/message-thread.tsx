'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface MessageThreadProps {
  sessionId: string;
}

interface Message {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    author: 'Léa',
    body: 'Salut ! On commence vers 20h, prévoyez d'arriver 10 min avant :)',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    author: 'Marc',
    body: 'Je peux ramener des cookies maison !',
    createdAt: new Date().toISOString(),
  },
];

export function MessageThread({ sessionId }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const { publish } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    const newMessage: Message = {
      id: crypto.randomUUID(),
      author: 'Vous',
      body: input.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    publish({ title: 'Message envoyé', description: 'Votre message a été partagé avec les participants.' });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Espace de discussion</h2>
        <span className="text-xs uppercase tracking-wide text-slate-400">Thread #{sessionId.slice(0, 6)}</span>
      </div>
      <div className="flex max-h-72 flex-col gap-3 overflow-y-auto rounded-2xl bg-slate-50 p-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">{message.author}</span>
              <span className="text-[11px] text-slate-400">{new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className={cn('rounded-2xl bg-white px-3 py-2 text-sm text-slate-600 shadow-sm')}>{message.body}</p>
          </div>
        ))}
        {messages.length === 0 ? <p className="text-sm text-slate-500">Aucun message pour le moment.</p> : null}
      </div>
      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <textarea
          className="min-h-[60px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Partagez un message ou proposez ce que vous apportez..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          type="submit"
          className="h-fit rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Envoyer
        </button>
      </form>
    </section>
  );
}