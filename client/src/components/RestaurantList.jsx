// import React, { useEffect, useContext } from "react";
// import RestaurantFinder from "../apis/RestaurantFinder";
// import { RestaurantsContext } from "../context/RestaurantsContext";
// import { useNavigate } from "react-router-dom";
// import StarRating from "./StarRating";

// const RestaurantList = (props) => {
//   const { restaurants, setRestaurants } = useContext(RestaurantsContext);
//   let navigate = useNavigate();
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await RestaurantFinder.get("/");
//         console.log(response.data.data);
//         setRestaurants(response.data.data.restaurants);
//       } catch (err) {}
//     };

//     fetchData();
//   }, [setRestaurants]);

//   const handleDelete = async (e, id) => {
//     e.stopPropagation();
//     try {
//       await RestaurantFinder.delete(`/${id}`);
//       setRestaurants(
//         restaurants.filter((restaurant) => {
//           return restaurant.id !== id;
//         })
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdate = (e, id) => {
//     e.stopPropagation();
//     navigate(`/restaurants/${id}/update`);
//   };

//   const handleRestaurantSelect = (id) => {
//     navigate(`/restaurants/${id}`);
//   };

//   const renderRating = (restaurant) => {
//     if (!restaurant.count) {
//       return <span className="text-warning">0 reviews</span>;
//     }
//     return (
//       <>
//         <StarRating rating={restaurant.id} />
//         <span className="text-warning ml-1">({restaurant.count})</span>
//       </>
//     );
//   };

//   return (
//     <div className="list-group">
//       <table className="table table-hover table-dark">
//         <thead>
//           <tr className="bg-primary">
//             <th scope="col">Restaurant</th>
//             <th scope="col">Location</th>
//             <th scope="col">Price Range</th>
//             <th scope="col">Ratings</th>
//             <th scope="col">Edit</th>
//             <th scope="col">Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {restaurants &&
//             restaurants.map((restaurant) => {
//               return (
//                 <tr
//                   onClick={() => handleRestaurantSelect(restaurant.id)}
//                   key={restaurant.id}
//                 >
//                   <td>{restaurant.name}</td>
//                   <td>{restaurant.location}</td>
//                   <td>{"$".repeat(restaurant.price_range)}</td>
//                   <td>{renderRating(restaurant)}</td>
//                   <td>
//                     <button
//                       onClick={(e) => handleUpdate(e, restaurant.id)}
//                       className="btn btn-warning"
//                     >
//                       Update
//                     </button>
//                   </td>
//                   <td>
//                     <button
//                       onClick={(e) => handleDelete(e, restaurant.id)}
//                       className="btn btn-danger"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RestaurantList;


import React, { useEffect, useContext, useCallback } from "react";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const RestaurantList = () => {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get("/");
        setRestaurants(response.data.data.restaurants);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchData();
  }, [setRestaurants]);

  const handleDelete = useCallback(async (e, id) => {
    e.stopPropagation();
    try {
      await RestaurantFinder.delete(`/${id}`);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== id)
      );
    } catch (err) {
      console.error("Error deleting restaurant:", err);
    }
  }, [setRestaurants]);

  const handleUpdate = useCallback(
    (e, id) => {
      e.stopPropagation();
      navigate(`/restaurants/${id}/update`);
    },
    [navigate]
  );

  const handleRestaurantSelect = useCallback(
    (id) => {
      navigate(`/restaurants/${id}`);
    },
    [navigate]
  );

  const renderRating = useCallback((restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }
    return (
      <>
        <StarRating rating={restaurant.id} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  }, []);

  return (
    <div className="list-group">
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody onClick={(e) => e.target.tagName !== "BUTTON" && handleRestaurantSelect(restaurant.id)}>
          {restaurants &&
            restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>{"$".repeat(restaurant.price_range)}</td>
                <td>{renderRating(restaurant)}</td>
                <td>
                  <button
                    onClick={(e) => handleUpdate(e, restaurant.id)}
                    className="btn btn-warning"
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => handleDelete(e, restaurant.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(RestaurantList);
