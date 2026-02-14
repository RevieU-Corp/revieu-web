import { GoogleGenerativeAI } from "@google/generative-ai";
import { PendingReviewMerchant, UserProfile } from '../types';

// TODO: Move API key to environment variable for security
const genAI = new GoogleGenerativeAI('AIzaSyDCInZ57xrv6hpYu-oGqPfm0wa8zEHYYBM');

const MOCK_PENDING_REVIEW_MERCHANTS: PendingReviewMerchant[] = [
  {
    id: 'm1',
    businessName: 'Sushirrito',
    businessImage: 'https://picsum.photos/id/292/100/100',
    lastVisitedAt: 'Yesterday',
    lastOrderItems: ['Sumo Crunch', 'Lava Nachos'],
  },
  {
    id: 'm2',
    businessName: 'Philz Coffee',
    businessImage: 'https://picsum.photos/id/431/100/100',
    lastVisitedAt: 'Jan 22',
    lastOrderItems: ['Mint Mojito', 'Avocado Toast'],
  },
  {
    id: 'm3',
    businessName: 'Urban Ritual',
    businessImage: 'https://picsum.photos/id/63/100/100',
    lastVisitedAt: 'Jan 19',
    lastOrderItems: ['Dirty Horchata', 'Classic Milk Tea'],
  },
];

/**
 * Generates a creative bio for the user using Google's Gemini AI
 * @param user - The user profile to generate bio for
 * @param interests - Array of user interests to incorporate
 * @returns A creative bio string (max 60 characters)
 */
export const generateCreativeBio = async (
  user: UserProfile,
  interests: string[]
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Generate a short, engaging bio (max 60 characters) for a user on a local review platform called RevieU.

User: ${user.name}
Location: ${user.location}
Level: ${user.level}
Reviews: ${user.stats.totalReviews}
Current bio: ${user.bio}
Interests: ${interests.join(', ')}

Requirements:
- Max 60 characters
- Include 1-3 relevant emojis
- Natural and authentic tone
- Capture local explorer spirit

Return ONLY the bio text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedBio = response.text().trim();

    // Ensure max 60 characters
    return generatedBio.length > 60
      ? generatedBio.substring(0, 57) + '...'
      : generatedBio;

  } catch (error) {
    console.error('Failed to generate bio:', error);
    // Fallback to original bio on error
    return user.bio;
  }
};

async function fetchPendingReviewMerchantsFromApi(): Promise<PendingReviewMerchant[]> {
  // API entry reserved for backend integration.
  // TODO: replace with real endpoint call, e.g.
  // const response = await apiClient.get<PendingReviewMerchant[]>('/user/merchants/pending-reviews');
  // return response.data;
  return [];
}

export const getLatestVisitedMerchantsWithoutReview = async (): Promise<PendingReviewMerchant[]> => {
  const apiMerchants = await fetchPendingReviewMerchantsFromApi();
  if (apiMerchants.length > 0) {
    return apiMerchants;
  }

  return MOCK_PENDING_REVIEW_MERCHANTS;
};
