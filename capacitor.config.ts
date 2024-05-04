import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'CreoFit',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '545703554991-0mohb7lktpgm2fc8s3c8s2shg2kdr5hg.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
