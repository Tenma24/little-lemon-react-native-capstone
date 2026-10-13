import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { categories, filterMenu, isValidProfile, normalizeProfile, blankProfile, STORAGE_KEY } from './src/model';

const Session = createContext(null);
const Stack = createNativeStackNavigator();
const green = '#495E57', yellow = '#F4CE14';
const pictures = { salad: require('./assets/salad.jpg'), bruschetta: require('./assets/bruschetta.jpg'), pasta: require('./assets/pasta.jpg'), fish: require('./assets/fish.jpg'), cake: require('./assets/cake.jpg'), lemonade: require('./assets/lemonade.jpg') };
function Button({ title, onPress, disabled = false, secondary = false }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, disabled && s.disabled, pressed && { opacity: .75 }]}><Text style={s.buttonText}>{title}</Text></Pressable>;
}
function Field({ label, ...props }) {
  return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} placeholderTextColor="#79847F" {...props} /></View>;
}
function Brand() { return <View style={s.brand}><Text style={s.lemon}>◒</Text><Text style={s.brandText}>LITTLE LEMON</Text></View>; }
function Message({ children, error = false }) { return children ? <Text accessibilityLiveRegion="polite" style={[s.message, error && { color: '#9C3328' }]}>{children}</Text> : null; }
function Page({ children, style }) { return <SafeAreaView style={s.safe}><KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={style}>{children}</ScrollView></KeyboardAvoidingView></SafeAreaView>; }
function Onboarding() {
  const { save } = useContext(Session);
  const [draft, setDraft] = useState(blankProfile());
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function next() {
    if (!isValidProfile(draft) || busy) return;
    setBusy(true); setError('');
    try { await save(draft); } catch { setError('Could not save your details. Please try again.'); } finally { setBusy(false); }
  }
  return <Page style={s.onboard}>
    <Brand /><View style={s.welcomeArt}><Image source={pictures.salad} style={s.welcomeImage} /><View style={s.welcomeTag}><Text style={s.eyebrow}>FRESH. LOCAL. MADE WITH LOVE.</Text></View></View>
    <Text style={s.kicker}>A LITTLE TASTE OF CHICAGO</Text><Text style={s.title}>Welcome to{'\n'}Little Lemon.</Text><Text style={s.body}>Mediterranean favorites, a warm welcome, and something delicious for everyone.</Text>
    <Text style={s.sectionTitle}>Let’s get to know you</Text>
    <Field label="First name" placeholder="Your first name" autoComplete="given-name" value={draft.firstName} onChangeText={firstName => setDraft({ ...draft, firstName })} />
    <Field label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={draft.email} onChangeText={email => setDraft({ ...draft, email })} />
    <Text style={s.hint}>Enter your first name and a valid email to continue. Your details stay on this device.</Text><Message error>{error}</Message>
    <Button title={busy ? 'Saving…' : 'Next'} onPress={next} disabled={!isValidProfile(draft) || busy} /><Text style={s.footer}>GOOD FOOD. GOOD COMPANY.</Text>
  </Page>;
}
function Home({ navigation }) {
  const { profile } = useContext(Session);
  const [query, setQuery] = useState(''), [selected, setSelected] = useState('All');
  const items = filterMenu(query, selected);
  return <Page style={{ paddingBottom: 24 }}>
    <View style={s.header}><Brand /><Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => navigation.navigate('Profile')} style={s.avatar}><Text style={s.avatarText}>{profile.firstName[0].toUpperCase()}{profile.lastName?.[0]?.toUpperCase()}</Text></Pressable></View>
    <View style={s.hero}><Text style={s.heroTitle}>Little Lemon</Text><Text style={s.city}>Chicago</Text><View style={s.heroRow}><Text style={s.heroBody}>We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text><Image source={pictures.bruschetta} style={s.heroImage} accessibilityLabel="Illustration of fresh bruschetta" /></View>
      <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput accessibilityLabel="Search menu" placeholder="Search for a dish…" value={query} onChangeText={setQuery} style={s.searchInput} placeholderTextColor="#6B7772" /><Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={s.clear}><Text>{query ? '✕' : ''}</Text></Pressable></View>
    </View>
    <View style={s.menu}><View style={s.menuHeading}><Text style={s.sectionTitle}>Today’s menu</Text><Text style={s.hint}>{items.length} dishes</Text></View><Text style={s.body}>A little sunshine on your plate.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categories}>{categories.map(category => <Pressable key={category} accessibilityRole="button" accessibilityState={{ selected: selected === category }} onPress={() => setSelected(category)} style={[s.chip, selected === category && s.chipActive]}><Text style={[s.chipText, selected === category && s.chipTextActive]}>{category}</Text></Pressable>)}</ScrollView>
      {items.map(item => <View key={item.id} style={s.dish}><View style={s.dishCopy}><Text style={s.dishName}>{item.name}</Text><Text style={s.dishDescription}>{item.description}</Text><Text style={s.price}>${item.price.toFixed(2)}</Text></View><Image source={pictures[item.image]} style={s.dishImage} accessibilityLabel={item.name} /></View>)}
      {!items.length && <View style={s.empty}><Text style={s.sectionTitle}>No dishes found</Text><Text style={s.body}>Try another search or category.</Text><Button title="Show all dishes" secondary onPress={() => { setQuery(''); setSelected('All'); }} /></View>}
      <Text style={s.footer}>MADE WITH LOVE · LITTLE LEMON CHICAGO</Text>
    </View>
  </Page>;
}
function Profile({ navigation }) {
  const { profile, save, logout } = useContext(Session);
  const [draft, setDraft] = useState({ ...profile });
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const update = (key, value) => { setDraft(p => ({ ...p, [key]: value })); setMessage(''); setError(''); };
  async function persist() {
    if (!isValidProfile(draft) || busy) return;
    setBusy(true); setMessage(''); setError('');
    try { await save(draft); setDraft(normalizeProfile(draft)); setMessage('Changes saved.'); } catch { setError('Could not save changes. Please try again.'); } finally { setBusy(false); }
  }
  async function signout() { setBusy(true); setError(''); try { await logout(); } catch { setError('Could not log out. Please try again.'); setBusy(false); } }
  return <Page style={s.profile}>
    <View style={[s.header, { paddingHorizontal: 0 }]}><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={s.back}><Text style={s.backText}>←</Text></Pressable><Brand /><View style={{ width: 42 }} /></View>
    <Text style={s.kicker}>MAKE YOURSELF AT HOME</Text><Text style={s.title}>Your profile</Text><Text style={s.body}>The little details that make it yours.</Text>
    <View style={s.profileIdentity}><View style={s.largeAvatar}><Text style={s.largeAvatarText}>{draft.firstName?.[0]?.toUpperCase() || '?'}{draft.lastName?.[0]?.toUpperCase()}</Text></View><View><Text style={s.sectionTitle}>{draft.firstName || 'Your name'}</Text><Text style={s.hint}>Little Lemon guest</Text></View></View>
    <Text style={s.sectionTitle}>Personal information</Text>
    <Field label="First name" value={draft.firstName} onChangeText={v => update('firstName', v)} autoComplete="given-name" />
    <Field label="Last name" value={draft.lastName} onChangeText={v => update('lastName', v)} autoComplete="family-name" />
    <Field label="Email" value={draft.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
    <Field label="Phone number" value={draft.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" autoComplete="tel" />
    <Text style={[s.sectionTitle, { marginTop: 16 }]}>Email preferences</Text>
    {[['orderUpdates', 'Order updates'], ['newsletter', 'News and special offers']].map(([key, label]) => <View key={key} style={s.toggle}><Text style={s.body}>{label}</Text><Switch accessibilityLabel={label} value={draft[key]} onValueChange={v => update(key, v)} trackColor={{ false: '#CED5D1', true: green }} thumbColor="#FFFFFF" /></View>)}
    <Text style={s.hint}>Preferences are saved locally. This demo does not send emails.</Text>
    <Message>{message}</Message><Message error>{error}</Message>
    <Button title={busy ? 'Please wait…' : 'Save changes'} onPress={persist} disabled={!isValidProfile(draft) || busy} />
    <Button title="Discard changes" secondary disabled={busy} onPress={() => { setDraft({ ...profile }); setError(''); setMessage('Unsaved changes discarded.'); }} />
    <View style={s.logout}><Button title="Log out" secondary disabled={busy} onPress={signout} /><Text style={s.hint}>Logging out removes your saved profile from this device.</Text></View>
  </Page>;
}
export default function App() {
  const [profile, setProfile] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  async function restore() {
    setLoading(true); setError('');
    try { const raw = await AsyncStorage.getItem(STORAGE_KEY); if (raw) { let data; try { data = JSON.parse(raw); } catch { data = null; } if (isValidProfile(data)) setProfile(normalizeProfile(data)); else await AsyncStorage.removeItem(STORAGE_KEY); } } catch { setError('Your profile could not be loaded. Please retry.'); } finally { setLoading(false); }
  }
  useEffect(() => { restore(); }, []);
  async function save(value) { const next = normalizeProfile(value); await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setProfile(next); }
  async function logout() { await AsyncStorage.removeItem(STORAGE_KEY); setProfile(null); }
  return <SafeAreaProvider><StatusBar style="dark" /><View style={s.app}>{loading ? <View style={s.loading}><ActivityIndicator color={green} /><Text style={s.body}>Preparing your table…</Text></View> : error ? <View style={s.loading}><Message error>{error}</Message><Button title="Retry" onPress={restore} /></View> : <Session.Provider value={{ profile, save, logout }}><NavigationContainer><Stack.Navigator id="RootStack" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FAFBF8' } }}>{profile ? <Stack.Group navigationKey="guest"><Stack.Screen name="Home" component={Home} /><Stack.Screen name="Profile" component={Profile} /></Stack.Group> : <Stack.Screen name="Onboarding" component={Onboarding} />}</Stack.Navigator></NavigationContainer></Session.Provider>}</View></SafeAreaProvider>;
}
const s = StyleSheet.create({
  flex: { flex: 1 }, app: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center', backgroundColor: '#FAFBF8' }, safe: { flex: 1, backgroundColor: '#FAFBF8' }, loading: { flex: 1, padding: 32, justifyContent: 'center', gap: 16 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 }, lemon: { color: yellow, fontSize: 38, fontWeight: '900', transform: [{ rotate: '-35deg' }] }, brandText: { color: green, fontWeight: '800', fontSize: 16, letterSpacing: 1.5 },
  onboard: { padding: 26, paddingBottom: 40, gap: 8 }, welcomeArt: { marginTop: 16, marginBottom: 20, borderRadius: 22, overflow: 'hidden', backgroundColor: '#EAEDE3' }, welcomeImage: { width: '100%', height: 180 }, welcomeTag: { padding: 12, backgroundColor: green }, eyebrow: { color: '#FFFFFF', textAlign: 'center', fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  kicker: { color: green, fontSize: 10, letterSpacing: 2, fontWeight: '800', marginTop: 8 }, title: { color: '#253A32', fontSize: 38, lineHeight: 43, fontWeight: '700', marginBottom: 8 }, body: { color: '#58665F', fontSize: 15, lineHeight: 23 }, sectionTitle: { color: '#253A32', fontSize: 21, fontWeight: '700', marginVertical: 10 },
  field: { marginTop: 8 }, label: { color: green, fontSize: 13, fontWeight: '700', marginBottom: 7 }, input: { borderColor: '#CBD3CD', borderWidth: 1, borderRadius: 10, backgroundColor: '#FFFFFF', padding: 14, fontSize: 16, color: '#253A32', minHeight: 50 }, hint: { fontSize: 12, lineHeight: 18, color: '#69766F', marginVertical: 5 },
  button: { backgroundColor: yellow, borderRadius: 12, minHeight: 50, justifyContent: 'center', alignItems: 'center', padding: 14, marginTop: 10 }, buttonText: { fontSize: 15, fontWeight: '800', color: '#253A32' }, secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: green }, disabled: { opacity: .4 }, message: { color: green, fontSize: 14, paddingVertical: 8 }, footer: { textAlign: 'center', fontSize: 9, letterSpacing: 1.5, color: '#79867F', marginTop: 28, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 14 }, avatar: { backgroundColor: '#E5EBE1', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, avatarText: { fontWeight: '800', color: green },
  hero: { backgroundColor: green, padding: 24 }, heroTitle: { color: yellow, fontSize: 43, fontWeight: '600', letterSpacing: -1 }, city: { color: '#FFFFFF', fontSize: 25, marginBottom: 10 }, heroRow: { flexDirection: 'row', gap: 18, alignItems: 'center' }, heroBody: { flex: 1, color: '#F1F3ED', fontSize: 15, lineHeight: 22 }, heroImage: { width: 118, height: 138, borderRadius: 15 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, marginTop: 22, minHeight: 48, paddingLeft: 14 }, searchIcon: { fontSize: 27, color: green }, searchInput: { flex: 1, padding: 12, fontSize: 15, color: '#253A32' }, clear: { width: 38, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  menu: { padding: 24 }, menuHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, categories: { gap: 8, paddingTop: 18, paddingBottom: 20 }, chip: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 22, backgroundColor: '#E9EDE5' }, chipActive: { backgroundColor: green }, chipText: { fontSize: 13, color: green, fontWeight: '700' }, chipTextActive: { color: '#FFFFFF' },
  dish: { flexDirection: 'row', gap: 16, borderTopWidth: 1, borderColor: '#DEE3DB', paddingVertical: 20, alignItems: 'center' }, dishCopy: { flex: 1 }, dishName: { fontSize: 18, fontWeight: '700', color: '#253A32', marginBottom: 7 }, dishDescription: { fontSize: 13, lineHeight: 20, color: '#69766F' }, price: { color: green, fontSize: 16, fontWeight: '800', marginTop: 9 }, dishImage: { width: 98, height: 104, borderRadius: 12 }, empty: { paddingVertical: 24 },
  profile: { paddingHorizontal: 24, paddingBottom: 36 }, back: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E9EDE5', justifyContent: 'center', alignItems: 'center' }, backText: { fontSize: 24, color: green }, profileIdentity: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 24 }, largeAvatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: green, justifyContent: 'center', alignItems: 'center' }, largeAvatarText: { color: yellow, fontSize: 27, fontWeight: '700' }, toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }, logout: { borderTopWidth: 1, borderColor: '#DEE3DB', marginTop: 25, paddingTop: 12 }
});

