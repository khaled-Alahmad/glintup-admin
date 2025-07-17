export interface Gift {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  icon: string;
  icon_url: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGiftData {
  name_ar: string;
  name_en: string;
  icon?: File;
  is_active: boolean;
  order: number;
}

export interface UpdateGiftData {
  name_ar?: string;
  name_en?: string;
  icon?: File;
  is_active?: boolean;
  order?: number;
}
