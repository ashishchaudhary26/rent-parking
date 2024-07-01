import axios from "axios";
const BASE_URL = "https://localhost:3000";

export const fetchParkings = async ({ user_id, setParkings }) => {
  try {
    let query = "";
    if (user_id) {
      query += `?user_id=${user_id}`;
    }
    const result = await axios.get(`${BASE_URL}parking${query}`);
    if (result?.data?.length) {
      setParkings(result?.data);
    }
    console.log("fetchParkings ", result);
  } catch (error) {
    console.error("fetchParkings ", error);
  }
};

export const deleteParking = async ({
  id,
  handleDeleteParkingSuccess,
  handleDeleteParkingFailure,
}) => {
  try {
    const result = await axios.delete(`${BASE_URL}parking/${id}`);
    if (result?.data?.message) {
      return handleDeleteParkingSuccess(result.message);
    }
    console.log("deleteParking ", result);
  } catch (error) {
    console.error("deleteParking ", error);
    handleDeleteParkingFailure(error?.response?.data?.error);
  }
};

export const createParking = async ({
  body,
  handleCreateParkingSuccess,
  handleCreateParkingFailure,
}) => {
  try {
    const result = await axios.post(`${BASE_URL}parking`, { ...body });
    if (result?.data?.parking) {
      return handleCreateParkingSuccess(result.data);
    }
    console.log("createParking ", result);
  } catch (error) {
    console.error("createParking ", error);
    handleCreateParkingFailure(error?.response?.data?.error);
  }
};

export const updateParking = async ({
  id,
  body,
  handleUpdateParkingSuccess,
  handleUpdateParkingFailure,
}) => {
  try {
    const result = await axios.put(`${BASE_URL}parking/${id}`, { ...body });
    if (result?.data?.message) {
      return handleUpdateParkingSuccess(result.data);
    }
    console.log("updateParking ", result);
  } catch (error) {
    console.error("updateParking ", error);
    handleUpdateParkingFailure(error?.response?.data?.error);
  }
};

export const fetchSpaces = async ({
  user_id,
  parking_id,
  city,
  date,
  time,
  availability,
  setSpaces,
}) => {
  try {
    let query = "";
    if (user_id) {
      query += `user_id=${user_id}&`;
    }
    if (parking_id) {
      query += `parking_id=${parking_id}&`;
    }
    if (city) {
      query += `city=${city}&`;
    }
    if (date) {
      query += `date=${date}&`;
    }
    if (time) {
      query += `time=${time}&`;
    }
    if (availability) {
      query += `availability=${availability}`;
    }
    const result = await axios.get(`${BASE_URL}space?${query}`);
    if (result?.data?.length) {
      setSpaces(result?.data);
    }
    console.log("fetchSpaces ", result);
  } catch (error) {
    console.error("fetchSpaces ", error);
  }
};
