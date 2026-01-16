/**
 * Firebase Analytics
 */
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from './init.js';

const analytics = getAnalytics(app);

export function trackEvent(name, params) {
  logEvent(analytics, name, params);
  console.log(`Tracked event: ${name}`);
}
