import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Card,
  Avatar,
  CardContent,
  CardHeader,
  Divider,
  Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// Fix marker icon issue in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    }
  });
  return null;
}

export default function RegisterStore() {
  const { register, handleSubmit } = useForm();
  const [image, setImage] = useState(null);
  const [displyImage, setDisplyImage] = useState(null);
  const [mapLocation, setMapLocation] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!image || !mapLocation) {
      alert("Please upload an image and select a location.");
      return;
    }

    const formData = new FormData();
    formData.append("shopeImg", image); // الملف نفسه
    formData.append("ownerShope", data.owner);
    formData.append("nameShope", data.storeName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("descripition", data.description);
    formData.append("latitude", mapLocation.lat);
    formData.append("longitude", mapLocation.lng);

    try {
      const response = await fetch("http://localhost:3000/api/v1/shop", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Store registered successfully!");
        setTimeout(() => {
          navigate(`/auth/login`);
        }, 1500);
      } else {
        toast.error("Failed to register store: " + result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while submitting.");
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // خزّن الملف مباشرة
    }
    setDisplyImage(URL.createObjectURL(e.target.files[0]))
  };
  console.log(image);


  return (
    <Card sx={{ maxWidth: 1000, mt: 5, boxShadow: 4, borderRadius: 3 }} >
      <ToastContainer />
      <CardHeader
        title="Register Your Store"
        sx={{ backgroundColor: '#333', color: 'white', textAlign: 'center' }}
      />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ padding: 3 }}>
            {/* صورة المتجر */}
            <Button variant="contained" component="label" fullWidth color="warning">
              Upload Store Image
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
            </Button>
            {image && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Avatar src={displyImage} sx={{ width: 80, height: 80 }} />
              </Box>
            )}

            {/* الحقول النصية */}
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt={3}>
              <Box width={{ xs: '100%', md: '48%' }} mb={2}>
                <TextField label="Store Owner" fullWidth {...register("owner")} />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} mb={2}>
                <TextField label="Store Name" fullWidth {...register("storeName")} />
              </Box>

              <Box width={{ xs: '100%', md: '48%' }} mb={2}>
                <TextField label="Email" type="email" fullWidth {...register("email")} />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} mb={2}>
                <TextField label="Password" type="password" fullWidth {...register("password")} />
              </Box>

              <Box width="100%" mb={2}>
                <TextField label="Phone Number" fullWidth {...register("phone")} />
              </Box>

              <Box width="100%" mb={2}>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  {...register("description")}
                />
              </Box>
            </Box>

            {/* الخريطة */}
            <Box my={3}>
              <Typography variant="subtitle1" gutterBottom>
                Select Store Location
              </Typography>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
                <MapContainer
                  center={[30.0444, 31.2357]}
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onSelect={setMapLocation} />
                  {mapLocation && <Marker position={mapLocation} />}
                </MapContainer>
              </Box>

            </Box>

            {/* زر التسجيل */}
            <Button type="submit" variant="contained" fullWidth color="info" size="large">
              Register Store
            </Button>
          </Box>

        </form>
      </CardContent>
    </Card>
  );
}
