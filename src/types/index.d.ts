declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}

interface School {
  id: string;
  name: string;
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  logo?: string;
  photos: string[];
  attachments: string[];
  averageRating: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Rating {
  id: string;
  schoolId: string;
  userId: string;
  rating: number;
  timestamp: Date;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
}

interface SchoolListProps {
  schools: School[];
}

interface SchoolMapProps {
  schools: School[];
}

interface RatingComponentProps {
  schoolId: string;
  currentRating?: number;
  onRatingSubmit: (rating: number) => void;
}

interface ProfileInfoProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
}

interface UserRatingsProps {
  ratings: Rating[];
}

interface ProfileImageUploadProps {
  onUpload: (imageUrl: string) => void;
}
