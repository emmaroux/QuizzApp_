import React, { useState } from 'react';
import { X, AlertTriangle, Check, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Question } from '../types';

interface ReportModalProps {
  question: Question;
  onClose: () => void;
}

type ReportType = 'answer' | 'explanation' | 'difficulty' | 'other';

interface ReportForm {
  type: ReportType;
  suggestedAnswer?: boolean;
  suggestedExplanation?: string;
  suggestedDifficulty?: number;
  message: string;
}

const REPORT_TYPES = [
  { 
    id: 'answer', 
    label: 'La réponse (Vrai/Faux) est incorrecte',
    description: 'La réponse donnée ne correspond pas à la réalité'
  },
  { 
    id: 'explanation', 
    label: "L'explication n'est pas claire ou est erronée",
    description: "L'explication donnée contient des erreurs ou manque de clarté"
  },
  { 
    id: 'difficulty', 
    label: 'Le niveau de difficulté est mal évalué',
    description: 'Le niveau de difficulté ne correspond pas au contenu'
  },
  { 
    id: 'other', 
    label: 'Autre problème',
    description: 'Tout autre type de problème avec la question'
  }
];

export function ReportModal({ question, onClose }: ReportModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ReportForm>({
    type: 'answer',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { error } = await supabase
        .from('question_reports')
        .insert([{
          question_id: question.id,
          report_type: form.type,
          suggested_answer: form.suggestedAnswer,
          suggested_explanation: form.suggestedExplanation,
          suggested_difficulty: form.suggestedDifficulty,
          message: form.message
        }]);

      if (error) throw error;
      setSent(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">Signaler un problème</h3>
        </div>

        {/* Détails de la question */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Question concernée :
            </h4>
            {question.difficulty && (
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                Niveau {question.difficulty}
              </span>
            )}
          </div>
          <p className="text-gray-700 mb-4">{question.statement}</p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Réponse :</span>{' '}
              <span className={question.answer ? 'text-green-600' : 'text-red-600'}>
                {question.answer ? 'Vrai' : 'Faux'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Explication :</span>{' '}
              {question.explanation}
            </p>
            {question.detailed_explanation && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-gray-700">
                  <span className="font-medium">En savoir plus :</span>{' '}
                  {question.detailed_explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">
              Merci pour votre signalement ! Nous allons l'examiner rapidement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Quel type de problème souhaitez-vous signaler ?
                </p>
                
                {REPORT_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setForm(f => ({ ...f, type: type.id as ReportType }));
                      setStep(2);
                    }}
                    className="w-full p-4 text-left border rounded-lg hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {form.type === 'answer' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Quelle devrait être la bonne réponse selon vous ?
                    </p>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, suggestedAnswer: true }))}
                        className={`flex-1 py-2 px-4 rounded-lg ${
                          form.suggestedAnswer === true
                            ? 'bg-green-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-700'
                        }`}
                      >
                        Vrai
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, suggestedAnswer: false }))}
                        className={`flex-1 py-2 px-4 rounded-lg ${
                          form.suggestedAnswer === false
                            ? 'bg-red-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-700'
                        }`}
                      >
                        Faux
                      </button>
                    </div>
                  </div>
                )}

                {form.type === 'explanation' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suggestion d'explication
                    </label>
                    <textarea
                      value={form.suggestedExplanation || ''}
                      onChange={e => setForm(f => ({ ...f, suggestedExplanation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                      placeholder="Proposez une meilleure explication..."
                    />
                  </div>
                )}

                {form.type === 'difficulty' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Quel niveau de difficulté suggérez-vous ?
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, suggestedDifficulty: level }))}
                          className={`flex-1 py-2 px-4 rounded-lg ${
                            form.suggestedDifficulty === level
                              ? 'bg-indigo-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commentaire additionnel
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    required
                    placeholder="Expliquez en détail le problème que vous avez identifié..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !form.message.trim()}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {sending ? 'Envoi...' : 'Envoyer le signalement'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}