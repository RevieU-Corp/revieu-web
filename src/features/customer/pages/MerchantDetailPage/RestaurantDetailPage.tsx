import { useNavigate } from 'react-router-dom';
import { RestaurantDetail } from './components/RestaurantDetail';
import { PATHS } from '../../../../routes/paths';

const RestaurantDetailPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(PATHS.CUSTOMER.DISCOVER);
  };

  const handleViewAllReviews = () => {
    // Navigate to reviews page using existing MERCHANT_INFO pattern
    const merchantId = '1'; // 这里应该从URL参数或props中获取实际的商户ID
    navigate(`/customer/merchant/${merchantId}/reviews`);
  };

  return (
    <RestaurantDetail 
      onBack={handleBack}
      onViewAllReviews={handleViewAllReviews}
    />
  );
};

export default RestaurantDetailPage;