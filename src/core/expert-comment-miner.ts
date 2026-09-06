import { Comment } from './types.js';

export interface ExpertComment {
  comment: Comment;
  technicalDepthScore: number; // 0 - 100
  category: 'TOOL_RECOMMENDATION' | 'EDGE_CASE_WARNING' | 'ALTERNATIVE_ARCHITECTURE' | 'COMMUNITY_DEBATE' | 'GENERAL_FEEDBACK';
  detectedTools: string[];
  keyInsight: string;
}

export interface DiscoveredTool {
  name: string;
  mentionCount: number;
  category: string;
  contexts: string[];
}

export interface ExpertInsightsReport {
  totalAnalyzed: number;
  highSignalCount: number;
  noisePercentage: number;
  topExpertComments: ExpertComment[];
  discoveredTools: DiscoveredTool[];
  recommendedStudyTopics: string[];
  markdownAppendix: string;
}

export class ExpertCommentMiner {
  private static readonly KNOWN_TECH_CATALOG: Record<string, string> = {
    'envoy': 'API Gateway & Service Proxy',
    'kong': 'API Gateway',
    'nginx': 'Reverse Proxy & Web Server',
    'haproxy': 'Load Balancer',
    'ebpf': 'Kernel-level Packet Filtering',
    'xdp': 'Express Data Path (Kernel DDoS mitigation)',
    'kafka': 'Distributed Event Streaming',
    'rabbitmq': 'Message Broker',
    'redis': 'In-Memory Data Store & Queueing',
    'cloudflare': 'Edge Cloud & Waiting Room CDN',
    'fido2': 'Passwordless Strong Authentication',
    'webauthn': 'W3C Authentication Standard',
    'totp': 'Time-based One-Time Password',
    'jwt': 'JSON Web Tokens',
    'fail2ban': 'Intrusion Prevention Framework',
    'mcaptcha': 'Proof-of-Work CAPTCHA Alternative',
    'fingerprintjs': 'Device Identification Library'
  };

  public static analyzeComments(comments: Comment[]): ExpertInsightsReport {
    if (!comments || comments.length === 0) {
      return this.emptyReport();
    }

    const analyzedList: ExpertComment[] = [];
    let noiseCount = 0;
    const toolMentionsMap: Map<string, { count: number; category: string; contexts: string[] }> = new Map();

    for (const comment of comments) {
      const text = comment.text || '';
      const lower = text.toLowerCase();

      // Check for low-value noise
      const isNoise = this.isLowValueComment(text);
      if (isNoise) {
        noiseCount++;
        continue;
      }

      // Detect technical tools
      const detectedTools: string[] = [];
      for (const [toolKey, toolCat] of Object.entries(this.KNOWN_TECH_CATALOG)) {
        const regex = new RegExp(`\\b${toolKey}\\b`, 'i');
        if (regex.test(lower)) {
          detectedTools.push(toolKey.toUpperCase());

          const existing = toolMentionsMap.get(toolKey.toUpperCase()) || {
            count: 0,
            category: toolCat,
            contexts: []
          };
          existing.count++;
          if (existing.contexts.length < 3) {
            existing.contexts.push(text.slice(0, 100));
          }
          toolMentionsMap.set(toolKey.toUpperCase(), existing);
        }
      }

      // Compute technical depth score (0 - 100)
      const score = this.calculateTechnicalDepth(text, detectedTools);

      // Determine category
      let category: ExpertComment['category'] = 'GENERAL_FEEDBACK';
      if (lower.includes('pero') || lower.includes('sin embargo') || lower.includes('ojo') || lower.includes('riesgo') || lower.includes('falso positivo') || lower.includes('sim swap')) {
        category = 'EDGE_CASE_WARNING';
      } else if (detectedTools.length > 0) {
        category = 'TOOL_RECOMMENDATION';
      } else if (lower.includes('mejor usar') || lower.includes('en lugar de') || lower.includes('arquitectura')) {
        category = 'ALTERNATIVE_ARCHITECTURE';
      } else if (text.includes('?')) {
        category = 'COMMUNITY_DEBATE';
      }

      if (score >= 35) {
        analyzedList.push({
          comment,
          technicalDepthScore: score,
          category,
          detectedTools,
          keyInsight: this.extractKeyInsight(text)
        });
      } else {
        noiseCount++;
      }
    }

    // Sort by technical depth descending
    analyzedList.sort((a, b) => b.technicalDepthScore - a.technicalDepthScore);

    const discoveredTools: DiscoveredTool[] = Array.from(toolMentionsMap.entries()).map(([name, data]) => ({
      name,
      mentionCount: data.count,
      category: data.category,
      contexts: data.contexts
    }));
    discoveredTools.sort((a, b) => b.mentionCount - a.mentionCount);

    const recommendedStudyTopics: string[] = this.deriveStudyTopics(discoveredTools, analyzedList);

    const markdownAppendix = this.generateMarkdownAppendix(analyzedList, discoveredTools, recommendedStudyTopics);

    return {
      totalAnalyzed: comments.length,
      highSignalCount: analyzedList.length,
      noisePercentage: comments.length > 0 ? Math.round((noiseCount / comments.length) * 100) : 0,
      topExpertComments: analyzedList.slice(0, 10),
      discoveredTools,
      recommendedStudyTopics,
      markdownAppendix
    };
  }

  private static isLowValueComment(text: string): boolean {
    const trimmed = text.trim();
    if (trimmed.length < 15) return true;
    const genericWords = [
      'excelente', 'buen', 'video', 'crack', 'top', 'gracias', 'saludos',
      'buenísimo', 'genial', 'totalmente', 'amen', 'tremendo', 'hermano', 'amigo', 'bro'
    ];
    const lower = trimmed.toLowerCase();
    const cleanWords = lower.replace(/[\p{Emoji}\s\d.,!¡?¿]+/gu, ' ').trim().split(/\s+/);
    if (cleanWords.length <= 5 && cleanWords.every(w => genericWords.includes(w))) {
      return true;
    }
    // Only emojis or numbers
    if (/^[\p{Emoji}\s\d.,!]+$/u.test(trimmed)) {
      return true;
    }
    return false;
  }

  private static calculateTechnicalDepth(text: string, tools: string[]): number {
    let score = 20; // base for non-noise
    const len = text.length;

    if (len > 80) score += 15;
    if (len > 180) score += 20;

    score += Math.min(tools.length * 15, 30);

    const technicalMarkers = [
      'gateway', 'cluster', 'throughput', 'latencia', 'concurrencia',
      'falso positivo', 'produccion', 'producción', 'servidor', 'balanceador',
      'hash', 'algoritmo', 'token', 'cache', 'query', 'payload', 'socket'
    ];

    for (const marker of technicalMarkers) {
      if (text.toLowerCase().includes(marker)) {
        score += 5;
      }
    }

    return Math.min(100, score);
  }

  private static extractKeyInsight(text: string): string {
    const firstSentence = text.split(/[.\n!?]/)[0];
    return firstSentence.length > 120 ? `${firstSentence.slice(0, 117)}...` : firstSentence;
  }

  private static deriveStudyTopics(tools: DiscoveredTool[], comments: ExpertComment[]): string[] {
    const topics: string[] = [];
    if (tools.some(t => t.name === 'EBPF' || t.name === 'XDP')) {
      topics.push('Mitigación de DDoS a nivel Kernel con eBPF/XDP sin sobrecargar API Gateways.');
    }
    if (tools.some(t => t.name === 'WEBAUTHN' || t.name === 'FIDO2')) {
      topics.push('Sustitución de SMS OTP por Passkeys (WebAuthn / FIDO2) frente a ataques de SIM Swapping.');
    }
    if (tools.some(t => t.name === 'ENVOY' || t.name === 'KONG')) {
      topics.push('Implementación de Global Rate Limiting distribuido con Envoy Proxy y Redis.');
    }
    if (comments.some(c => c.category === 'EDGE_CASE_WARNING')) {
      topics.push('Manejo de falsos positivos en bot detection para usuarios legítimos en redes corporativas / VPNs.');
    }

    if (topics.length === 0) {
      topics.push('Algoritmos de Rate Limiting: Token Bucket vs Leaky Bucket vs Sliding Window Counter.');
      topics.push('Dimensionamiento de Redis Sorted Sets para colas virtuales de más de 1 millón de usuarios.');
    }

    return topics;
  }

  private static generateMarkdownAppendix(comments: ExpertComment[], tools: DiscoveredTool[], studyTopics: string[]): string {
    if (comments.length === 0) {
      return '\n*No se detectaron comentarios técnicos en esta muestra.*';
    }

    return `
---

## 👥 6. Minería de Inteligencia Comunitaria (Comentarios Expertos)

Se analizaron los comentarios de la comunidad para extraer herramientas y advertencias de producción aportadas por desarrolladores:

### 🛠️ Herramientas y Tecnologías Citadas por la Comunidad:
${tools.length > 0 
  ? tools.map(t => `- **${t.name}** (${t.category}): Mencionado ${t.mentionCount} veces.`).join('\n')
  : '- *Ninguna herramienta adicional registrada.*'}

### ⚠️ Advertencias de Producción y Casos Límite:
${comments.filter(c => c.category === 'EDGE_CASE_WARNING').slice(0, 5).map(c => `
> **@${c.comment.author.username}** (Puntuación Técnica: \`${c.technicalDepthScore}/100\`):  
> "${c.comment.text}"  
> *💡 Aprendizaje*: ${c.keyInsight}
`).join('\n')}

### 📖 Nuevos Temas de Estudio Derivados de la Comunidad:
${studyTopics.map((topic, i) => `${i + 1}. **${topic}**`).join('\n')}
`;
  }

  private static emptyReport(): ExpertInsightsReport {
    return {
      totalAnalyzed: 0,
      highSignalCount: 0,
      noisePercentage: 0,
      topExpertComments: [],
      discoveredTools: [],
      recommendedStudyTopics: [
        'Algoritmos de Rate Limiting: Token Bucket vs Leaky Bucket.',
        'Colas virtuales en Redis y Cloudflare Waiting Room.'
      ],
      markdownAppendix: ''
    };
  }
}
