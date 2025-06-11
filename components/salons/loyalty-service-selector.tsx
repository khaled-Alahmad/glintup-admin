import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchData } from "@/lib/apiHelper";

interface LoyaltyServiceSelectorProps {
  defaultValue?: string;
  onChange: (serviceId: string | null) => void;
}

interface LoyaltyService {
  id: number;
  name: {
    ar: string;
    en: string;
  };
  price: number;
  currency: string;
}

export function LoyaltyServiceSelector({ defaultValue, onChange }: LoyaltyServiceSelectorProps) {
  const [initialOptions, setInitialOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);

  // Cargar servicios iniciales
  useEffect(() => {
    const loadInitialServices = async () => {
      try {
        const response = await fetchData('admin/services');
        if (response.success) {
          const options = response.data.map((service: LoyaltyService) => ({
            value: service.id.toString(),
            label: `${service.name.ar} - ${service.price} ${service.currency}`
          }));
          setInitialOptions(options);
          
          // Si hay un valor por defecto, busca el servicio correspondiente
          if (defaultValue) {
            const defaultService = response.data.find(
              (s: LoyaltyService) => s.id.toString() === defaultValue
            );
            if (defaultService) {
              setSelectedOption({
                value: defaultService.id.toString(),
                label: `${defaultService.name.ar} - ${defaultService.price} ${defaultService.currency}`
              });
            }
          }
        }
      } catch (error) {
        console.error("Error cargando servicios iniciales:", error);
      }
    };
    
    loadInitialServices();
  }, [defaultValue]);

  // Función para cargar opciones al buscar
  const loadOptions = async (inputValue: string) => {
    try {
      if (inputValue.trim().length < 2) {
        return initialOptions;
      }

      const response = await fetchData(`admin/services?search=${inputValue}`);
      if (response.success) {
        return response.data.map((service: LoyaltyService) => ({
          value: service.id.toString(),
          label: `${service.name.ar} - ${service.price} ${service.currency}`
        }));
      }
      return [];
    } catch (error) {
      console.error("Error buscando servicios:", error);
      return [];
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="loyalty_service_id">خدمة الولاء</Label>
      <div className="relative">
        <AsyncSelect
          inputId="loyalty_service_select"
          cacheOptions
          defaultOptions={initialOptions}
          placeholder="ابحث عن خدمة الولاء..."
          loadOptions={loadOptions}
          value={selectedOption}
          onChange={(option: any) => {
            setSelectedOption(option);
            onChange(option ? option.value : null);
          }}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              minHeight: '40px',
              borderRadius: '0.375rem',
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              zIndex: 50
            }),
          }}
          noOptionsMessage={() => "لا توجد نتائج"}
          loadingMessage={() => "جاري البحث..."}
          isClearable
          isRtl={true}
        />
        
        {/* Hidden input for form submission */}
        <Input
          id="loyalty_service_id"
          name="loyalty_service_id"
          type="hidden"
          value={selectedOption?.value || ""}
          readOnly
        />
      </div>
    </div>
  );
}
