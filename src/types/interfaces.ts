export interface IUserMongooseModel {
  fullName: string;
  email: string;
  password: string;
  refreshToken: string;
  comparePassword: (password: string) => Promise<boolean>;
  createAccessToken: () => string;
  createRefreshToken: () => string;
};

type TravelType = 'relax' | 'adventure' | 'cultural' | 'leisure' | 'honeymoon' | 'business';
type TravelingWith = 'solo' | 'family' | 'friends' | 'partner';
type BudgetType = 'budget' | 'mid-range' | 'luxury';
type StayType = 'hotel' | 'hostel' | 'resort' | 'camping';
type FoodType = 'vegan' | 'vegeterian' | 'non-veg';

// Input data type
export interface TripRequest {
  destination: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  travelingWith: TravelingWith;
  travelType: TravelType;
  travlerCount: number;
  budget: BudgetType;
  stay: StayType;
  foodPreferance: FoodType;
};

// Output data type
export interface TripItinerary {
  createdBy: string;
  tripTitle: string;
  destination: string;
  imageUrl: string;
  overview: string;
  dailyPlan: Array<{
    day: number;
    date: string;
    activities: Array<{
      time: string;
      description: string;
      location: string;
      ticketPrice: number;
    }>;
  }>;
  budgetBreakdown: {
    category: string;
    estimateCost: string;
  },
  travelingWith: TravelingWith;
  travelType: TravelType;
  travlerCount: number;
  budget: BudgetType;
  stay: StayType;
  foodPreferance: FoodType;
};