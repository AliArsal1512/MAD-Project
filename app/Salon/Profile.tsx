import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { getSalonProfile, getServices } from "../apis/salonApi";
import Footer from "../components/salon/Footer";
import { useThemeContext } from "../contexts/ThemeContext";
import { AppDispatch } from "../store";
import { setSalonProfile } from "../store/slices/salonProfileSlice";

export default function Profile() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [salonData, setSalonData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(
      useCallback(() => {
        const onBackPress = () => {
          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => BackHandler.exitApp(),
              },
            ],
            { cancelable: false }
          );
          return true; // prevent default behavior
        };
  
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );
  
        return () => backHandler.remove();
      }, [])
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salonResult = await getSalonProfile();
        if (salonResult.error) throw new Error(salonResult.error);
        setSalonData(salonResult.profile);
        dispatch(setSalonProfile(salonResult.profile)); // ✅ Dispatching to Redux

        const serviceResult = await getServices();
        if (serviceResult.error) throw new Error(serviceResult.error);
        setServices(serviceResult.services);

        // console.log("Salon:", salonResult.profile);
        // console.log("Services:", serviceResult.services);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !salonData) {
    return (
      <SafeAreaView style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{
          color: colors.textSecondary,
          fontSize: 18,
          marginTop: 8
        }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.background
    }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16
        }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{
            color: colors.text,
            fontSize: 24,
            fontWeight: 'bold'
          }}>
            Profile
          </Text>
        </View>

        {/* Profile Image Section */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={
                salonData.image
                  ? { uri: salonData.image }
                  : require("../../assets/images/adaptive-icon.png")
              }
              style={{
                width: 160,
                height: 160,
                borderRadius: 16
              }}
            />
            <TouchableOpacity
              onPress={() => router.push("/Salon/edit-profile")}
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: colors.card,
                padding: 8,
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="camera" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={{
            color: colors.text,
            fontSize: 24,
            fontWeight: 'bold',
            marginTop: 16
          }}>
            {salonData.salon_name}
          </Text>
          <Text style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginLeft: 4
          }}>
            {salonData.average_rating?.toFixed(1) ?? "N/A"}
          </Text>

          {/* Rating Section */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8
          }}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={{
              color: colors.textSecondary,
              marginLeft: 4
            }}>
              ({salonData.total_reviews} reviews)
            </Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          onPress={() => router.push("/Salon/edit-profile")}
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            backgroundColor: colors.primary,
            padding: 12,
            borderRadius: 12
          }}
        >
          <Text style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        {/* Information Section */}
        <View style={{ padding: 16, marginTop: 16 }}>
          {/* Description */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 8
            }}>
              About
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {salonData.description}
            </Text>
          </View>

          {/* Location & Address */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 8
            }}>
              Location
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8
            }}>
              <Ionicons name="location" size={20} color={colors.textSecondary} />
              <Text style={{
                color: colors.textSecondary,
                marginLeft: 8
              }}>
                {salonData.address}
              </Text>
            </View>
            <Text style={{
              color: colors.textSecondary,
              marginLeft: 28
            }}>
              {salonData.address}
            </Text>
          </View>

          {/* Working Hours */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 8
            }}>
              Working Hours
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Ionicons name="time" size={20} color={colors.textSecondary} />
              <Text style={{
                color: colors.textSecondary,
                marginLeft: 8
              }}>
                {salonData.open_time} to {salonData.close_time}
              </Text>
            </View>
          </View>

          {/* Services */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 8
            }}>
              Services
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {services.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>
                  No services added yet.
                </Text>
              ) : (
                services.map((service) => (
                  <View
                    key={service.id}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 16,
                      marginBottom: 12,
                      borderRadius: 12,
                      backgroundColor: colors.card,
                      width: '100%'
                    }}
                  >
                    <Text style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      fontSize: 18
                    }}>
                      {service.name}
                    </Text>
                    <Text style={{
                      color: colors.textSecondary,
                      fontSize: 14
                    }}>
                      ${service.price} • {service.duration_minutes} min
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}
