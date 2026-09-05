# 🏛️ Modelo C4: Omni-Platform Social Comment Scraper

## 1. Nivel 1: Diagrama de Contexto del Sistema

```mermaid
flowchart TD
    User["👤 Usuario / Ingeniero de Datos"]
    System["📦 Omni-Platform Comment Scraper"]
    
    IG["📸 Instagram (Reels, Posts)"]
    YT["▶️ YouTube (Videos, Shorts)"]
    TT["🎵 TikTok (Videos)"]
    TG["✈️ Telegram (Canales, Grupos)"]
    FB["👥 Facebook (Posts, Reels)"]

    User -->|"Ejecuta CLI / API (--url, --limit, --format)"| System
    System -->|"Extracción SSR & GraphQL con cookies"| IG
    System -->|"Extracción Data API v3 & oEmbed"| YT
    System -->|"Extracción Web & Mobile API"| TT
    System -->|"Extracción Web Preview & Bot API"| TG
    System -->|"Extracción OpenGraph & Graph API"| FB
    System -->|"Genera JSON, CSV y Telemetría"| User
```

## 2. Nivel 2: Diagrama de Contenedores

```mermaid
flowchart LR
    subgraph Core["Omni Scraper Engine"]
        CLI["CLI Tool (src/cli/index.ts)"]
        Registry["AdapterRegistry (src/core/registry.ts)"]
        Normalizer["CommentNormalizer (src/core/normalizer.ts)"]
        Exporters["Exporters (JSON, CSV)"]
        Telemetry["Telemetry Logger (events.jsonl)"]
        
        CLI --> Registry
        Registry --> Normalizer
        Normalizer --> Exporters
        CLI --> Telemetry
    end

    subgraph Observability["Observabilidad (Puerto 3333)"]
        Dashboard["Mission Control Dashboard (observability/index.html)"]
        Server["Serve Dashboard (scripts/serve-dashboard.mjs)"]
        Server --> Dashboard
        Telemetry --> Server
    end
```

## 3. Nivel 3: Diagrama de Componentes (Arquitectura Hexagonal)

```mermaid
classDiagram
    class PlatformAdapter {
        <<interface>>
        +platform: Platform
        +canHandle(url: string): boolean
        +extractPostId(url: string): string
        +extractMetadata(url: string, options?: ScrapeOptions): Promise~PostMetadata~
        +scrapeComments(url: string, options?: ScrapeOptions): Promise~ScrapingResult~
    }

    class InstagramAdapter {
        +scrapeComments()
        +fetchCommentsViaGraphql()
    }

    class YouTubeAdapter {
        +scrapeComments()
    }

    class TelegramAdapter {
        +scrapeComments()
    }

    class TikTokAdapter {
        +scrapeComments()
    }

    class FacebookAdapter {
        +scrapeComments()
    }

    PlatformAdapter <|.. InstagramAdapter
    PlatformAdapter <|.. YouTubeAdapter
    PlatformAdapter <|.. TelegramAdapter
    PlatformAdapter <|.. TikTokAdapter
    PlatformAdapter <|.. FacebookAdapter
```
