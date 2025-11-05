'use client';

import { useState } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'textarea';
  options?: string[];
  required: boolean;
}

interface Answer {
  questionId: string;
  value: string | string[];
}

export default function Home() {
  const [stage, setStage] = useState<'initial' | 'questions' | 'result'>('initial');
  const [promptType, setPromptType] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const promptTypes = [
    { id: 'creative-writing', name: 'Escrita Criativa', icon: '✍️' },
    { id: 'code-generation', name: 'Geração de Código', icon: '💻' },
    { id: 'data-analysis', name: 'Análise de Dados', icon: '📊' },
    { id: 'content-marketing', name: 'Marketing de Conteúdo', icon: '📱' },
    { id: 'education', name: 'Educação/Tutoria', icon: '📚' },
    { id: 'business-strategy', name: 'Estratégia de Negócios', icon: '💼' },
    { id: 'technical-documentation', name: 'Documentação Técnica', icon: '📝' },
    { id: 'custom', name: 'Personalizado', icon: '⚙️' }
  ];

  const generateQuestions = (type: string): Question[] => {
    const baseQuestions: Question[] = [
      {
        id: 'objective',
        text: 'Qual é o objetivo principal do seu prompt?',
        type: 'textarea',
        required: true
      },
      {
        id: 'audience',
        text: 'Quem é o público-alvo?',
        type: 'text',
        required: true
      },
      {
        id: 'tone',
        text: 'Qual tom deseja para a resposta?',
        type: 'select',
        options: ['Profissional', 'Casual', 'Técnico', 'Criativo', 'Acadêmico', 'Persuasivo', 'Educacional'],
        required: true
      }
    ];

    const typeSpecificQuestions: Record<string, Question[]> = {
      'creative-writing': [
        {
          id: 'genre',
          text: 'Qual gênero literário?',
          type: 'select',
          options: ['Ficção Científica', 'Fantasia', 'Romance', 'Mistério', 'Terror', 'Drama', 'Comédia'],
          required: true
        },
        {
          id: 'length',
          text: 'Qual o comprimento desejado?',
          type: 'select',
          options: ['Curto (< 500 palavras)', 'Médio (500-2000 palavras)', 'Longo (> 2000 palavras)'],
          required: true
        },
        {
          id: 'elements',
          text: 'Elementos específicos a incluir?',
          type: 'textarea',
          required: false
        }
      ],
      'code-generation': [
        {
          id: 'language',
          text: 'Linguagem de programação?',
          type: 'select',
          options: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby'],
          required: true
        },
        {
          id: 'framework',
          text: 'Framework ou biblioteca específica?',
          type: 'text',
          required: false
        },
        {
          id: 'complexity',
          text: 'Nível de complexidade?',
          type: 'select',
          options: ['Iniciante', 'Intermediário', 'Avançado'],
          required: true
        },
        {
          id: 'requirements',
          text: 'Requisitos específicos ou funcionalidades?',
          type: 'textarea',
          required: true
        }
      ],
      'data-analysis': [
        {
          id: 'data-type',
          text: 'Tipo de dados a analisar?',
          type: 'select',
          options: ['Numérico', 'Textual', 'Temporal', 'Geoespacial', 'Categórico', 'Misto'],
          required: true
        },
        {
          id: 'analysis-goal',
          text: 'Objetivo da análise?',
          type: 'multiselect',
          options: ['Visualização', 'Previsão', 'Classificação', 'Clustering', 'Tendências', 'Correlações'],
          required: true
        },
        {
          id: 'tools',
          text: 'Ferramentas preferidas?',
          type: 'text',
          required: false
        }
      ],
      'content-marketing': [
        {
          id: 'platform',
          text: 'Plataforma de publicação?',
          type: 'multiselect',
          options: ['Blog', 'Instagram', 'LinkedIn', 'Twitter/X', 'Facebook', 'YouTube', 'TikTok', 'Email'],
          required: true
        },
        {
          id: 'cta',
          text: 'Call-to-action desejada?',
          type: 'text',
          required: false
        },
        {
          id: 'keywords',
          text: 'Palavras-chave importantes?',
          type: 'textarea',
          required: false
        }
      ],
      'education': [
        {
          id: 'subject',
          text: 'Assunto ou tópico?',
          type: 'text',
          required: true
        },
        {
          id: 'level',
          text: 'Nível educacional?',
          type: 'select',
          options: ['Fundamental', 'Médio', 'Superior', 'Pós-Graduação', 'Profissional'],
          required: true
        },
        {
          id: 'learning-style',
          text: 'Estilo de aprendizagem?',
          type: 'select',
          options: ['Visual', 'Auditivo', 'Prático', 'Leitura/Escrita', 'Misto'],
          required: true
        }
      ],
      'business-strategy': [
        {
          id: 'business-area',
          text: 'Área de negócio?',
          type: 'select',
          options: ['Marketing', 'Vendas', 'Operações', 'Financeiro', 'RH', 'Produto', 'Estratégia Geral'],
          required: true
        },
        {
          id: 'company-size',
          text: 'Tamanho da empresa?',
          type: 'select',
          options: ['Startup', 'Pequena', 'Média', 'Grande', 'Enterprise'],
          required: true
        },
        {
          id: 'challenge',
          text: 'Principal desafio ou questão?',
          type: 'textarea',
          required: true
        }
      ],
      'technical-documentation': [
        {
          id: 'doc-type',
          text: 'Tipo de documentação?',
          type: 'select',
          options: ['API', 'Guia de Usuário', 'Arquitetura', 'Tutorial', 'README', 'Troubleshooting'],
          required: true
        },
        {
          id: 'technical-level',
          text: 'Nível técnico do leitor?',
          type: 'select',
          options: ['Iniciante', 'Intermediário', 'Avançado', 'Expert'],
          required: true
        },
        {
          id: 'format',
          text: 'Formato preferido?',
          type: 'select',
          options: ['Markdown', 'HTML', 'PDF', 'Wiki', 'Interativo'],
          required: false
        }
      ],
      'custom': [
        {
          id: 'context',
          text: 'Contexto completo do que você precisa?',
          type: 'textarea',
          required: true
        },
        {
          id: 'constraints',
          text: 'Restrições ou requisitos específicos?',
          type: 'textarea',
          required: false
        },
        {
          id: 'examples',
          text: 'Exemplos do resultado desejado?',
          type: 'textarea',
          required: false
        }
      ]
    };

    return [...baseQuestions, ...(typeSpecificQuestions[type] || [])];
  };

  const startQuestionnaire = (type: string) => {
    setPromptType(type);
    const qs = generateQuestions(type);
    setQuestions(qs);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setStage('questions');
  };

  const handleAnswer = (questionId: string, value: string | string[]) => {
    const existingIndex = answers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...answers];

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, value };
    } else {
      newAnswers.push({ questionId, value });
    }

    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generateFinalPrompt();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const generateFinalPrompt = () => {
    const answerMap = answers.reduce((acc, answer) => {
      acc[answer.questionId] = answer.value;
      return acc;
    }, {} as Record<string, string | string[]>);

    let prompt = `# Prompt Complexo Gerado\n\n`;

    prompt += `## Contexto e Objetivo\n`;
    prompt += `${answerMap.objective}\n\n`;

    prompt += `## Especificações\n`;
    prompt += `- **Público-alvo**: ${answerMap.audience}\n`;
    prompt += `- **Tom**: ${answerMap.tone}\n`;

    questions.forEach(q => {
      if (q.id !== 'objective' && q.id !== 'audience' && q.id !== 'tone' && answerMap[q.id]) {
        const value = answerMap[q.id];
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        if (displayValue) {
          prompt += `- **${q.text.replace('?', '')}**: ${displayValue}\n`;
        }
      }
    });

    prompt += `\n## Instruções de Execução\n`;
    prompt += `Por favor, forneça uma resposta que:\n`;
    prompt += `1. Atenda ao objetivo especificado acima\n`;
    prompt += `2. Seja apropriada para o público-alvo mencionado\n`;
    prompt += `3. Mantenha o tom ${answerMap.tone}\n`;
    prompt += `4. Considere todas as especificações fornecidas\n`;

    if (promptType === 'code-generation') {
      prompt += `5. Inclua código bem documentado e testável\n`;
      prompt += `6. Forneça explicações para decisões técnicas importantes\n`;
    } else if (promptType === 'creative-writing') {
      prompt += `5. Seja criativo e envolvente\n`;
      prompt += `6. Mantenha consistência narrativa\n`;
    } else if (promptType === 'data-analysis') {
      prompt += `5. Apresente insights acionáveis\n`;
      prompt += `6. Use visualizações quando apropriado\n`;
    }

    prompt += `\n## Formato de Resposta\n`;
    prompt += `Estruture sua resposta de forma clara e organizada, usando seções e formatação apropriadas.\n`;

    setGeneratedPrompt(prompt);
    setStage('result');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt copiado para a área de transferência!');
  };

  const reset = () => {
    setStage('initial');
    setPromptType('');
    setQuestions([]);
    setAnswers([]);
    setGeneratedPrompt('');
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            🎯 Construtor de Prompts Complexos
          </h1>
          <p className="text-gray-600 text-lg">
            Sistema inteligente e interativo para criar prompts robustos e eficazes
          </p>
        </header>

        {stage === 'initial' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Selecione o tipo de prompt que deseja criar:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promptTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => startQuestionnaire(type.id)}
                    className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all transform hover:scale-105 shadow-md"
                  >
                    <span className="text-3xl">{type.icon}</span>
                    <span className="font-semibold text-lg">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                ✨ Recursos
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Questionário interativo personalizado por tipo de prompt</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Validação inteligente de respostas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Geração automática de prompts estruturados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Navegação fluida entre perguntas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Cópia rápida para área de transferência</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {stage === 'questions' && currentQuestion && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {currentQuestionIndex + 1} de {questions.length}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% completo
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion.text}
                {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={(currentAnswer?.value as string) || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  placeholder="Digite sua resposta..."
                />
              )}

              {currentQuestion.type === 'textarea' && (
                <textarea
                  value={(currentAnswer?.value as string) || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  placeholder="Digite sua resposta detalhada..."
                />
              )}

              {currentQuestion.type === 'select' && (
                <select
                  value={(currentAnswer?.value as string) || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                >
                  <option value="">Selecione uma opção...</option>
                  {currentQuestion.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}

              {currentQuestion.type === 'multiselect' && (
                <div className="space-y-2">
                  {currentQuestion.options?.map(option => (
                    <label key={option} className="flex items-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={((currentAnswer?.value as string[]) || []).includes(option)}
                        onChange={(e) => {
                          const current = (currentAnswer?.value as string[]) || [];
                          const newValue = e.target.checked
                            ? [...current, option]
                            : current.filter(v => v !== option);
                          handleAnswer(currentQuestion.id, newValue);
                        }}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Anterior
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestion.required && !currentAnswer?.value}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Gerar Prompt →' : 'Próxima →'}
              </button>
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">🎉</span>
                Seu Prompt Está Pronto!
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                >
                  📋 Copiar Prompt
                </button>
                <button
                  onClick={reset}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
                >
                  🔄 Criar Novo Prompt
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                💡 Dicas de Uso
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Cole este prompt em qualquer LLM (ChatGPT, Claude, etc.)</li>
                <li>• Você pode editar e ajustar o prompt antes de usar</li>
                <li>• Adicione exemplos específicos para resultados mais precisos</li>
                <li>• Teste variações do prompt para otimizar os resultados</li>
              </ul>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>Construído com Next.js, React e TypeScript</p>
          <p className="mt-1">Assistente Inteligente de Construção de Prompts © 2025</p>
        </footer>
      </div>
    </div>
  );
}
