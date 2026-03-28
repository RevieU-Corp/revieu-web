import { useNavigate, useParams } from 'react-router-dom';
import { RestaurantDetail } from './components/RestaurantDetail';
import { PATHS } from '../../../../routes/paths';

const RestaurantDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    navigate(PATHS.CUSTOMER.DISCOVER);
  };

  return (
    <RestaurantDetail 
      storeId={id}
      onBack={handleBack}
    />
  );
};

export default RestaurantDetailPage;
