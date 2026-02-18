# Lovable 프롬프트 2: FREE 결과 페이지

아래 내용을 Lovable 채팅창에 붙여넣으세요:

---

Create a new page at `/free-result` that displays the free Saju reading result. The page should:

1. Show a beautiful, minimal reading result
2. Have social share buttons
3. Include a prominent CTA to upgrade to the full reading

Here's the component code:

```tsx
// src/pages/FreeResult.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Mail, Twitter, ArrowRight } from "lucide-react";

interface SajuData {
  dayMaster: {
    elementEn: string;
    yin: boolean;
  };
  zodiac: {
    animalEn: string;
  };
  elementCount: Record<string, number>;
  dominantElement: string;
  weakestElement: string;
}

const ELEMENT_TRAITS: Record<string, { trait: string; phase: string; color: string }> = {
  Wood: {
    trait: "growth-oriented, flexible, and creative. Like a tree, you naturally reach toward new possibilities.",
    phase: "Expansion & New Beginnings",
    color: "text-green-600",
  },
  Fire: {
    trait: "passionate, expressive, and charismatic. You naturally light up spaces and inspire others.",
    phase: "Visibility & Self-Expression",
    color: "text-red-500",
  },
  Earth: {
    trait: "stable, nurturing, and reliable. You provide grounding energy to those around you.",
    phase: "Stability & Foundation",
    color: "text-amber-600",
  },
  Metal: {
    trait: "precise, refined, and determined. Like polished metal, you value quality, structure, and clarity.",
    phase: "Refinement & Consolidation",
    color: "text-gray-500",
  },
  Water: {
    trait: "intuitive, adaptable, and wise. You flow around obstacles rather than fighting them.",
    phase: "Reflection & Inner Wisdom",
    color: "text-blue-500",
  },
};

const ELEMENT_MAP: Record<string, string> = {
  "목": "Wood",
  "화": "Fire",
  "토": "Earth",
  "금": "Metal",
  "수": "Water",
};

export default function FreeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saju, userName } = location.state || {};

  if (!saju) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-xl mb-4">No reading found</h2>
          <Button onClick={() => navigate("/start")}>Start Your Reading</Button>
        </Card>
      </div>
    );
  }

  const element = saju.dayMaster.elementEn;
  const yinYang = saju.dayMaster.yin ? "Yin" : "Yang";
  const traits = ELEMENT_TRAITS[element];
  const dominantEn = ELEMENT_MAP[saju.dominantElement] || saju.dominantElement;
  const weakestEn = ELEMENT_MAP[saju.weakestElement] || saju.weakestElement;

  const handleShare = async () => {
    const text = `I just discovered I'm a ${yinYang} ${element} person! 🔮 Find your timing at when.app`;
    if (navigator.share) {
      await navigator.share({ title: "My WHEN Reading", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold tracking-wider">WHEN</a>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Greeting */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Your Timing Preview</p>
          <h1 className="text-3xl md:text-4xl font-serif mb-4">
            Hello, {userName || "there"}
          </h1>
          <p className="text-gray-600">
            Here's a glimpse into your natural timing based on Korean Four Pillars wisdom.
          </p>
        </div>

        {/* Current Phase */}
        <Card className="mb-8 border-0 shadow-sm bg-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌙</span>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Current Phase</p>
                <h2 className="text-2xl font-serif">{traits.phase}</h2>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              You're in a period of <span className="font-medium">{traits.phase.toLowerCase()}</span>. 
              This is a time to embrace your natural {element.toLowerCase()} energy and trust your instincts.
            </p>
          </CardContent>
        </Card>

        {/* Core Energy */}
        <Card className="mb-8 border-0 shadow-sm bg-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✨</span>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Core Energy</p>
                <h2 className={`text-2xl font-serif ${traits.color}`}>{yinYang} {element}</h2>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a <span className="font-medium">{yinYang} {element}</span> person, you are naturally {traits.trait}
            </p>
            <p className="text-gray-600 text-sm">
              Your {yinYang.toLowerCase()} nature means you tend to be more{" "}
              {yinYang === "Yin" 
                ? "introspective, receptive, and subtle" 
                : "outgoing, active, and direct"}{" "}
              in how you express this energy.
            </p>
          </CardContent>
        </Card>

        {/* Element Balance */}
        <Card className="mb-8 border-0 shadow-sm bg-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⚖️</span>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Element Balance</p>
                <h2 className="text-2xl font-serif">Your Natural Rhythm</h2>
              </div>
            </div>
            
            {/* Element Bars */}
            <div className="space-y-3 mb-6">
              {Object.entries(ELEMENT_MAP).map(([kr, en]) => (
                <div key={kr} className="flex items-center gap-3">
                  <span className="w-14 text-sm text-gray-600">{en}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${ELEMENT_TRAITS[en]?.color.replace('text-', 'bg-')} opacity-70`}
                      style={{ width: `${(saju.elementCount[kr] / 8) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-sm text-gray-500">{saju.elementCount[kr]}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed">
              With <span className="font-medium">{dominantEn}</span> as your strongest element, 
              you have abundant {dominantEn.toLowerCase()} energy. 
              Your <span className="font-medium">{weakestEn}</span> element is an area for growth and balance.
            </p>
          </CardContent>
        </Card>

        {/* Zodiac */}
        <Card className="mb-12 border-0 shadow-sm bg-white">
          <CardContent className="p-8 text-center">
            <span className="text-5xl mb-4 block">🐲</span>
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Your Zodiac</p>
            <h2 className="text-2xl font-serif">{saju.zodiac.animalEn}</h2>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#4a5d4a] to-[#3a4d3a] text-white overflow-hidden">
          <CardContent className="p-8 text-center">
            <span className="text-4xl mb-4 block">🔮</span>
            <h3 className="text-2xl font-serif mb-3">Your Full Timing Map Awaits</h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Unlock detailed insights across 8 life categories: Career, Love, Wealth, Health, 
              Relationships, Growth, Purpose, and your {new Date().getFullYear()} Forecast.
            </p>
            <div className="mb-4">
              <span className="text-3xl font-bold">$19.99</span>
              <span className="text-white/60 text-sm ml-2 line-through">$29.99</span>
              <span className="bg-white/20 text-xs px-2 py-1 rounded ml-2">BETA</span>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-[#4a5d4a] hover:bg-white/90"
              onClick={() => navigate("/checkout", { state: { saju, userName } })}
            >
              Unlock Full Reading <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-white/50 text-xs mt-4">30-day money-back guarantee</p>
          </CardContent>
        </Card>

        {/* Share Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Share your discovery</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just discovered I'm a ${yinYang} ${element} person! 🔮 Find your timing at when.app`)}`, '_blank')}
            >
              <Twitter className="w-4 h-4 mr-2" /> Tweet
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} WHEN. Not predictions. Perspective.</p>
      </footer>
    </div>
  );
}
```

Also add this route to your router configuration:

```tsx
import FreeResult from "./pages/FreeResult";

// In your routes:
<Route path="/free-result" element={<FreeResult />} />
```

And update the Start page form submission to navigate to this page with the saju data:

```tsx
// In Start.tsx, after form submission:
import { calculateSaju } from "@/lib/saju-calculator";

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const saju = calculateSaju(
    parseInt(birthYear),
    parseInt(birthMonth),
    parseInt(birthDay),
    birthHour ? parseInt(birthHour) : undefined
  );
  
  navigate("/free-result", { 
    state: { 
      saju, 
      userName: name 
    } 
  });
};
```
