// import React, { useState } from 'react';
// import Header from '../../components/User/Header';
// import HeroSection from '../../components/User/HeroSection';
// import CategorySection from '../../components/User/Category';
// import HotDeal from '../../components/User/HotDeal';
// import FeaturedHighlights from '../../components/User/FeaturedHighlights';
// import Footer from '../../components/User/Footer';
// import { useFetchAllProductsQuery } from '../../services/apis/sellerApi';
// import { ProductType } from '../../interface/sellerTypes/sellerApiTypes';
// import ProductSlider from '../../components/User/ActiveSlider';
// import ChatBot from '../../components/commen/ChatBot';
// import ChatButton from '../../components/commen/Buttons/ChatBotButton';

// const LandingPage: React.FC = () => {
//   const { data } = useFetchAllProductsQuery();
//   const products: ProductType[] = data?.products || [];
//   const [isChatOpen, setChatOpen] = useState(false);

//   const handleOpenChat = () => {
//     console.log('Opening chat...');
//     setChatOpen(true);
//   };

//   const handleCloseChat = () => {
//     setChatOpen(false);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-[#fcfaee]">
//       <Header />
//       <main className="border-bla flex-grow">
//         <HeroSection />

//         <div className="container mx-auto px-4 space-y-12 py-12">
//           {/* Auction Items in a Slider */}
//           <ProductSlider products={products} />
//           <ChatButton
//             onClick={handleOpenChat}
//             position={{ bottom: '20px', right: '20px' }}
//           />
//           {isChatOpen && (
//             <div className="fixed bottom-20 right-20 z-50">
//             <ChatBot onClose={handleCloseChat} />

//             </div>
//           )}
//           <CategorySection />
//           <HotDeal />
//           <FeaturedHighlights />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default LandingPage;

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../../components/User/Header';
import HeroSection from '../../components/User/HeroSection';
import CategorySection from '../../components/User/Category';
import HotDeal from '../../components/User/HotDeal';
import FeaturedHighlights from '../../components/User/FeaturedHighlights';
import Footer from '../../components/User/Footer';
import { useFetchAllProductsQuery } from '../../services/apis/productApi';
import { ProductType } from '../../interface/productTypes/productType';
import ProductSlider from '../../components/User/ActiveSlider';
import ChatBot from '../../components/commen/ChatBot';
import ChatButton from '../../components/commen/Buttons/ChatBotButton';

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const { data, isLoading, isError } = useFetchAllProductsQuery();
  const products: ProductType[] = data?.products || [];
  const [isChatOpen, setChatOpen] = useState(false);
console.log(products,'-----------------------------------')
  const productSliderRef = useRef(null);
  const categorySectionRef = useRef(null);
  const hotDealRef = useRef(null);
  const featuredHighlightsRef = useRef(null);

  useEffect(() => {
    if (isLoading || isError) return;

    // if (productSliderRef.current) {
    //   gsap.from(productSliderRef.current, {
    //     opacity: 0,
    //     y: 50,
    //     duration: 1,
    //     scrollTrigger: {
    //       trigger: productSliderRef.current,
    //       start: 'top bottom-=100',
    //       end: 'bottom center',
    //       toggleActions: 'play none none reverse',
    //     },
    //   });
    // }

    if (categorySectionRef.current) {
      gsap.from(categorySectionRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        scrollTrigger: {
          trigger: categorySectionRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (hotDealRef.current) {
      gsap.from(hotDealRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        scrollTrigger: {
          trigger: hotDealRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (featuredHighlightsRef.current) {
      gsap.from(featuredHighlightsRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: featuredHighlightsRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Cleanup GSAP scroll triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoading, isError]);

  const handleOpenChat = () => {
    console.log('Opening chat...');
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfaee]">
      <Header />
      <main className="flex-grow">
        <HeroSection />

        <div className="container mx-auto px-4 space-y-12 py-12">
          <div ref={productSliderRef}>
            <ProductSlider products={products} isLoading={isLoading} />
          </div>
          <ChatButton onClick={handleOpenChat} position={{ bottom: '20px', right: '20px' }} />
          {isChatOpen && (
            <div className="fixed bottom-20 right-20 z-50">
              <ChatBot onClose={handleCloseChat} />
            </div>
          )}
          <div ref={categorySectionRef}>
            <CategorySection />
          </div>
          <div ref={hotDealRef}>
            <HotDeal />
          </div>
          <div ref={featuredHighlightsRef}>
            <FeaturedHighlights />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
