import { useNavigate, useParams } from 'react-router-dom';
import { RestaurantDetail } from './components/RestaurantDetail';

const RestaurantDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <RestaurantDetail 
      storeId={id}
      onBack={handleBack}
    />
  );
};

export default RestaurantDetailPage;
