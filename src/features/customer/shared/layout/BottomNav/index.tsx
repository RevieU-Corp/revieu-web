import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { createPortal } from "react-dom";
import { PATHS } from "../../../../../routes/paths";
import { useAuth } from "../../../../../contexts/AuthContext";
import addReviewIcon from "../../../../../assets/images/customer/bottomNav/addReview.svg";
import homeIconRed from "../../../../../assets/images/customer/bottomNav/homeIconRed.svg";
import homeIconGrey from "../../../../../assets/images/customer/bottomNav/homeIconGrey.svg";
import profileIconRed from "../../../../../assets/images/customer/bottomNav/profileRed.svg";
import profileIconGrey from "../../../../../assets/images/customer/bottomNav/profileGrey.svg";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handlePostClick = () => {
    if (isAuthenticated) {
      navigate(PATHS.CUSTOMER.WRITE_REVIEW);
    } else {
      setShowLoginModal(true);
    }
  };

  const NavTab = ({
    path,
    activeIcon,
    inactiveIcon,
    label,
  }: {
    path: string;
    activeIcon: string;
    inactiveIcon: string;
    label: string;
  }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => navigate(path)}
        className="flex flex-col items-center justify-center gap-1 relative"
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
            active ? "bg-red-50 text-[#990000]" : "text-gray-500"
          }`}
        >
          <img
            src={active ? activeIcon : inactiveIcon}
            alt={`${label} icon`}
            className="w-5 h-5 object-contain"
          />
        </div>
        <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? "text-[#990000]" : "text-gray-500"}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white safe-area-bottom z-30">
      <div className="relative h-20 max-w-md mx-auto px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gray-200" />
        {/* <div className="absolute left-1/2 -translate-x-1/2 -top-[55px] w-28 h-[55px] bg-gray-200 pointer-events-none"> */}
        {/* </div> */}
        <button
          onClick={handlePostClick}
          className="absolute left-1/2 -translate-x-1/2 -top-7 w-14 h-14 p-0 bg-transparent border-0 shadow-none appearance-none overflow-visible"
        >
          <img src={addReviewIcon} alt="Add review" className="block w-full h-full object-contain" />
        </button>

        <div className="h-full flex items-end justify-between pb-3">
          <NavTab
            path={PATHS.CUSTOMER.HOME}
            activeIcon={homeIconRed}
            inactiveIcon={homeIconGrey}
            label="Home"
          />
          <div className="w-14" />
          <NavTab
            path={PATHS.CUSTOMER.ME.ROOT}
            activeIcon={profileIconRed}
            inactiveIcon={profileIconGrey}
            label="Profile"
          />
        </div>
      </div>

      {/* Login Required Modal - Portal to body */}
      {showLoginModal && createPortal(
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E5B80B] via-[#b80000] to-[#660000] flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-500 mb-6">Please login to share your review with the community.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate(PATHS.AUTH.LOGIN);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#990000] to-[#660000] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
