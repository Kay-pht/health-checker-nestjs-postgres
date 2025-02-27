export class UserDashboardDto {
  allergyList: {
    allergyId: string;
    allergyName: string;
    severity: string;
  }[];

  userInfo: {
    username: string;
    email: string;
  };
  analysisResults: {
    missingNutrients: string[];
    recommendedFoods: string[];
    score: number;
  }[];
}
