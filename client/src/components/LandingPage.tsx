import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypewriter } from 'react-simple-typewriter';
import { Button } from './ui/button';

interface LandingPageProps {
  landingPageKeyword?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ landingPageKeyword }) => {
  // const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const [text] = useTypewriter({
    words: ['product', 'travel location', 'lead', 'company', 'prospect', 'VC'],
    loop: true,
    delaySpeed: 500,
    deleteSpeed: 100,
  });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (prompt.trim()) {
  //     // Navigate to research page with the query parameter
  //     navigate(`/new?q=${encodeURIComponent(prompt.trim())}`);
  //   }
  // };

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* hero section */}
      <div className="w-full text-center py-16 md:py-24 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold my-6">Zcash Bounties</h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Zcash Bounties is a platform for finding and completing bounties on Zcash.
        </p>

        {/* Try it free now button */}
        <div className="flex justify-center mt-8">
          <Button
            className="bg-[#4169E1] hover:bg-[#3a5ecc] text-white px-8 py-6 text-lg"
            onClick={() => navigate('/login')}
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* footer section */}
      <div className="flex flex-row items-center justify-center mt-12 mb-8">
        <p className="text-muted-foreground">© 2025 Deep Table Research Inc.</p>
      </div>
    </div>
  );
};

export default LandingPage;
