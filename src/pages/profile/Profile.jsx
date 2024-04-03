import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { AuthContext } from '../../context/authContext';
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Update from '../../components/update/Update';
import Posts from '../../components/posts/Posts';
import './profile.scss';

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [relationshipData, setRelationshipData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userIdFromUrl = parseInt(location.pathname.split("/")[2]);
        setUserId(userIdFromUrl);

        const userDataResponse = await makeRequest.get("/users/find/" + userIdFromUrl);
        setUserData(userDataResponse.data);

        const relationshipDataResponse = await makeRequest.get("/relationships?followedUserId=" + userIdFromUrl);
        setRelationshipData(relationshipDataResponse.data);

        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [location.pathname]);

  const handleFollow = () => {
    const isFollowing = relationshipData.includes(currentUser.id);
    mutation.mutate(isFollowing);
    // Mettre à jour immédiatement l'état du bouton
    setRelationshipData(isFollowing ? relationshipData.filter(id => id !== currentUser.id) : [...relationshipData, currentUser.id]);
  };
  

  const mutation = useMutation(
    (following) => {
      if (following) return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"http://localhost:8800/images/"+userData.coverpic} alt="" className="cover" />
            <img src={"http://localhost:8800/images/"+userData.profilepic} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{userData.username}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>my city</span>s
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>my website</span>
                  </div>
                </div>
                {userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id) ? "Following" : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={userData} />}
    </div>
  );
};

export default Profile;
