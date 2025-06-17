
interface ConfigCheck {
  name: string;
  value: string | undefined;
  required: boolean;
  description: string;
}

export function checkDevConfiguration(): {
  isValid: boolean;
  issues: string[];
  config: ConfigCheck[];
} {
  const config: ConfigCheck[] = [
    {
      name: 'VITE_PRIVY_APP_ID',
      value: import.meta.env.VITE_PRIVY_APP_ID,
      required: true,
      description: 'Privy authentication app ID'
    },
    {
      name: 'VITE_SUPABASE_URL',
      value: import.meta.env.VITE_SUPABASE_URL,
      required: true,
      description: 'Supabase project URL'
    },
    {
      name: 'VITE_SUPABASE_ANON_KEY',
      value: import.meta.env.VITE_SUPABASE_ANON_KEY,
      required: true,
      description: 'Supabase anonymous key'
    },
    {
      name: 'VITE_CHAIN_ID',
      value: import.meta.env.VITE_CHAIN_ID,
      required: true,
      description: 'Blockchain network chain ID'
    },
    {
      name: 'VITE_RPC_URL',
      value: import.meta.env.VITE_RPC_URL,
      required: true,
      description: 'Blockchain RPC endpoint'
    },
    {
      name: 'VITE_ZORA_FACTORY_ADDRESS',
      value: import.meta.env.VITE_ZORA_FACTORY_ADDRESS,
      required: true,
      description: 'Zora factory contract address'
    },
    {
      name: 'VITE_USDC_ADDRESS',
      value: import.meta.env.VITE_USDC_ADDRESS,
      required: true,
      description: 'USDC contract address'
    },
    {
      name: 'VITE_ZORA_API_KEY',
      value: import.meta.env.VITE_ZORA_API_KEY,
      required: false,
      description: 'Zora API key (optional)'
    }
  ];

  const issues: string[] = [];
  const missingRequired = config.filter(c => c.required && !c.value);
  
  if (missingRequired.length > 0) {
    issues.push(`Missing required environment variables: ${missingRequired.map(c => c.name).join(', ')}`);
  }

  // Validate chain ID is a number
  const chainId = import.meta.env.VITE_CHAIN_ID;
  if (chainId && isNaN(Number(chainId))) {
    issues.push('VITE_CHAIN_ID must be a valid number');
  }

  // Validate URLs
  const urls = ['VITE_SUPABASE_URL', 'VITE_RPC_URL'];
  urls.forEach(urlVar => {
    const url = import.meta.env[urlVar];
    if (url && !url.startsWith('http')) {
      issues.push(`${urlVar} must be a valid URL starting with http/https`);
    }
  });

  // Validate contract addresses
  const addresses = ['VITE_ZORA_FACTORY_ADDRESS', 'VITE_USDC_ADDRESS'];
  addresses.forEach(addrVar => {
    const addr = import.meta.env[addrVar];
    if (addr && !addr.startsWith('0x')) {
      issues.push(`${addrVar} must be a valid Ethereum address starting with 0x`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    config
  };
}

export function logConfigurationStatus(): void {
  if (import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true') {
    const { isValid, issues, config } = checkDevConfiguration();
    
    console.group('🔧 NEPLUS Development Configuration');
    console.log('Status:', isValid ? '✅ Valid' : '❌ Issues found');
    
    if (!isValid) {
      console.group('⚠️ Issues:');
      issues.forEach(issue => console.warn(issue));
      console.groupEnd();
    }
    
    console.group('📋 Configuration:');
    config.forEach(({ name, value, required, description }) => {
      const status = value ? '✅' : (required ? '❌' : '⚠️');
      console.log(`${status} ${name}: ${value || 'Not set'} (${description})`);
    });
    console.groupEnd();
    
    console.groupEnd();
  }
}
