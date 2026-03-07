import { useNavigate, useParams } from 'react-router-dom';
import { RestaurantDetail } from './components/RestaurantDetail';
import { PATHS } from '../../../../routes/paths';

const RestaurantDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    navigate(PATHS.CUSTOMER.DISCOVER);
  };

  const handleViewAllReviews = () => {
    const merchantId = id ?? '1';
    navigate(`/customer/merchant/${merchantId}/reviews`);
  };

  const handleWriteReview = () => {
    navigate(PATHS.CUSTOMER.WRITE_REVIEW, {
      state: {
        merchantId: id,
      },
    });
  };

  return (
    <RestaurantDetail 
      onBack={handleBack}
      onViewAllReviews={handleViewAllReviews}
      onWriteReview={handleWriteReview}
    />
  );
};

export default RestaurantDetailPage;
