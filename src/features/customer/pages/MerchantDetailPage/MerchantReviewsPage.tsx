import { useNavigate, useParams } from 'react-router-dom';
import { ReviewListPage } from './components/ReviewListPage';

const MerchantReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    // 返回到商户详情页面
    navigate(`/customer/merchant/${id || '1'}`);
  };

  return (
    <ReviewListPage onBack={handleBack} />
  );
};

export default MerchantReviewsPage;