import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentCustomerProfile } from '../apis/customerApi';
import Footer from '../components/customer/Footer';
import { useThemeContext } from '../contexts/ThemeContext';

const initialCustomerInfo = {
  image:
    'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
  name: '',
  phone: '',
  email: '',
  gender: '',
};

export default function CustomerProfile() {
  const { colors } = useThemeContext();
  const [customerInfo, setCustomerInfo] = useState(initialCustomerInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCall = () => {
    if (!isEditing) Linking.openURL(`tel:${customerInfo.phone}`);
  };

  useEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const { profile, error } = await getCurrentCustomerProfile();
      if (error) {
        Alert.alert("Error", error);
      } else {
        setCustomerInfo({
          image:
            'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
          name: profile.full_name || '',
          phone: profile.phone || '',
          gender: profile.gender || '',
          email: profile.email || '',
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <Text style={{ color: colors.text }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.background
    }}>
      <ScrollView style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 40
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          {/* Edit/Save Toggle */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              backgroundColor: colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderRadius: 8,
            }}
            onPress={() => router.push('/Customer/edit-profile')}
          >
            <Text style={{
              color: 'white',
              fontWeight: '600'
            }}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>

          {/* Profile Image and Name */}
          <View style={{
            alignItems: 'center',
            marginBottom: 24,
            marginTop: 40,
            width: '100%'
          }}>
            <Image
              source={{ uri: customerInfo.image }}
              style={{
                width: 128,
                height: 128,
                borderRadius: 64,
                marginBottom: 16
              }}
            />
            {isEditing ? (
              <TextInput
                value={customerInfo.name}
                onChangeText={(text) => handleChange('name', text)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  width: '100%',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text,
                  backgroundColor: colors.card,
                }}
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={{
                color: colors.text,
                fontSize: 24,
                fontWeight: 'bold'
              }}>
                {customerInfo.name}
              </Text>
            )}
          </View>

          {/* Phone */}
          <View style={{ marginBottom: 16, width: '100%' }}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 4
            }}>
              📞 Phone
            </Text>
            {isEditing ? (
              <TextInput
                value={customerInfo.phone}
                onChangeText={(text) => handleChange('phone', text)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: colors.text,
                  backgroundColor: colors.card,
                }}
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <TouchableOpacity onPress={handleCall}>
                <Text style={{
                  color: colors.primary,
                  textDecorationLine: 'underline'
                }}>
                  {customerInfo.phone}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Email */}
          <View style={{ marginBottom: 16, width: '100%' }}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 4
            }}>
              📧 Email
            </Text>
            {isEditing ? (
              <TextInput
                value={customerInfo.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: colors.text,
                  backgroundColor: colors.card,
                }}
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={{ color: colors.textSecondary }}>
                {customerInfo.email}
              </Text>
            )}
          </View>

          {/* Gender */}
          <View style={{ marginBottom: 40, width: '100%' }}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 4
            }}>
              ⚧ Gender
            </Text>
            {isEditing ? (
              <TextInput
                value={customerInfo.gender}
                onChangeText={(text) => handleChange('gender', text)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: colors.text,
                  backgroundColor: colors.card,
                }}
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={{ color: colors.textSecondary }}>
                {customerInfo.gender}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}
