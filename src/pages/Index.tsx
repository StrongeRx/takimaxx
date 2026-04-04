import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import MarqueeBanner from "@/components/MarqueeBanner";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background header-offset" style={{ paddingTop: 96 }}>
      <SEO
        title="Takimax | Takı, Aksesuar ve Kozmetik – Türkiye'nin Online Mağazası"
        description="Takimax ile 925 ayar gümüş kolye, küpe, bileklik, yüzük ve daha fazlası uygun fiyatlarla kapınızda. Kadın, erkek ve çocuk aksesuar ile kozmetik ürünlerde güvenli alışveriş, hızlı kargo."
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Takimax – Ana Sayfa",
          "url": "https://takimax.com",
          "description": "Türkiye'nin online takı ve aksesuar mağazası.",
        }}
      />
      <AnnouncementBar />
      <Header />
      <MarqueeBanner />
      <HeroSection />
      <MarqueeBanner />
      <CategoryGrid />
      <MarqueeBanner />
      <ProductGrid mode="new_arrivals" />
      <MarqueeBanner />
      <ProductGrid mode="bestsellers" />
      <Footer />
    </div>
  );
};

export default Index;