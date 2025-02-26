'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { providers, LLMProvider } from '@/lib/llm-providers';

interface ModelSelectorProps {
  currentProvider: string;
  currentModel: string;
  onProviderChange: (providerId: string) => void;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({
  currentProvider,
  currentModel,
  onProviderChange,
  onModelChange,
  disabled = false
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>(
    providers.find(p => p.id === currentProvider) || providers[0]
  );

  const handleSelectProvider = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    onProviderChange(provider.id);
    // Select default model when changing provider
    onModelChange(provider.defaultModel);
    setIsOpen(false);
  };

  const handleSelectModel = (modelId: string) => {
    onModelChange(modelId);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Button
          variant="outline" 
          className="w-full justify-between bg-black/20 hover:bg-black/30 border-white/10"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="flex items-center">
            <Sparkles size={16} className="mr-2 text-[rgb(var(--agent-primary))]" />
            <span>{selectedProvider.name}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-md z-10">
            {providers.map((provider) => (
              <button
                key={provider.id}
                className={`w-full px-3 py-2 text-left rounded-md hover:bg-white/5 ${
                  provider.id === selectedProvider.id ? 'bg-white/10' : ''
                }`}
                onClick={() => handleSelectProvider(provider)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {provider.icon ? (
                      <div className="w-5 h-5 mr-2 relative">
                        <Image 
                          src={provider.icon} 
                          alt={provider.name} 
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Sparkles size={16} className="mr-2 text-[#00FF80]" />
                    )}
                    <span>{provider.name}</span>
                  </div>
                  {provider.id === selectedProvider.id && (
                    <Check size={16} className="text-[#00FF80]" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{provider.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Model select options for the selected provider */}
      <div className="mt-2 flex flex-wrap gap-1">
        {selectedProvider.models.map((model) => (
          <Button
            key={model.id}
            variant={model.id === currentModel ? "default" : "outline"}
            size="sm"
            className={`px-2 py-1 text-xs ${
              model.id === currentModel 
                ? "bg-[#00FF80]/20 border border-[#00FF80]/50 text-[#00FF80]" 
                : "bg-black/20 hover:bg-black/30 border-white/10"
            }`}
            onClick={() => handleSelectModel(model.id)}
            disabled={disabled}
            title={model.description}
          >
            {model.name}
          </Button>
        ))}
      </div>
    </div>
  );
}