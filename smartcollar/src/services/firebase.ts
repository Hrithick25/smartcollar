import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { Dog, SensorData, Intervention } from '@/types';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

class FirebaseService {
  // Authentication methods
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async signUp(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Real-time data methods
  subscribeToDogData(dogId: string, callback: (data: SensorData[]) => void): () => void {
    const q = query(
      collection(db, 'sensor_data'),
      where('dog_id', '==', dogId),
      orderBy('recorded_at', 'desc'),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      const data: SensorData[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as SensorData);
      });
      callback(data);
    });
  }

  subscribeToInterventions(callback: (interventions: Intervention[]) => void): () => void {
    const q = query(
      collection(db, 'interventions'),
      orderBy('triggered_at', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const interventions: Intervention[] = [];
      snapshot.forEach((doc) => {
        interventions.push({ id: doc.id, ...doc.data() } as Intervention);
      });
      callback(interventions);
    });
  }

  subscribeToDogInterventions(dogId: string, callback: (interventions: Intervention[]) => void): () => void {
    const q = query(
      collection(db, 'interventions'),
      where('dog_id', '==', dogId),
      orderBy('triggered_at', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const interventions: Intervention[] = [];
      snapshot.forEach((doc) => {
        interventions.push({ id: doc.id, ...doc.data() } as Intervention);
      });
      callback(interventions);
    });
  }

  // Dog management methods
  async getDogs(): Promise<Dog[]> {
    const querySnapshot = await getDocs(collection(db, 'dogs'));
    const dogs: Dog[] = [];
    querySnapshot.forEach((doc) => {
      dogs.push({ id: doc.id, ...doc.data() } as Dog);
    });
    return dogs;
  }

  async getDog(dogId: string): Promise<Dog | null> {
    const docRef = doc(db, 'dogs', dogId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Dog;
    }
    return null;
  }

  async createDog(dogData: Omit<Dog, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'dogs'), {
      ...dogData,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  }

  async updateDog(dogId: string, dogData: Partial<Dog>): Promise<void> {
    const docRef = doc(db, 'dogs', dogId);
    await updateDoc(docRef, {
      ...dogData,
      updated_at: Timestamp.now()
    });
  }

  async deleteDog(dogId: string): Promise<void> {
    const docRef = doc(db, 'dogs', dogId);
    await deleteDoc(docRef);
  }

  // File upload methods
  async uploadDogPhoto(dogId: string, file: File): Promise<string> {
    const storageRef = ref(storage, `dog-photos/${dogId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update dog record with photo URL
    await this.updateDog(dogId, { photo_url: downloadURL });
    
    return downloadURL;
  }

  async deleteDogPhoto(dogId: string, photoUrl: string): Promise<void> {
    try {
      const photoRef = ref(storage, photoUrl);
      await deleteObject(photoRef);
      
      // Update dog record to remove photo URL
      await this.updateDog(dogId, { photo_url: null });
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }

  // Sensor data methods
  async getSensorData(dogId: string, limitCount: number = 100): Promise<SensorData[]> {
    const q = query(
      collection(db, 'sensor_data'),
      where('dog_id', '==', dogId),
      orderBy('recorded_at', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const data: SensorData[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as SensorData);
    });
    return data;
  }

  async createSensorData(sensorData: Omit<SensorData, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'sensor_data'), {
      ...sensorData,
      recorded_at: Timestamp.now()
    });
    return docRef.id;
  }

  // Intervention methods
  async getInterventions(dogId?: string): Promise<Intervention[]> {
    let q = query(
      collection(db, 'interventions'),
      orderBy('triggered_at', 'desc'),
      limit(100)
    );

    if (dogId) {
      q = query(
        collection(db, 'interventions'),
        where('dog_id', '==', dogId),
        orderBy('triggered_at', 'desc'),
        limit(100)
      );
    }

    const querySnapshot = await getDocs(q);
    const interventions: Intervention[] = [];
    querySnapshot.forEach((doc) => {
      interventions.push({ id: doc.id, ...doc.data() } as Intervention);
    });
    return interventions;
  }

  async createIntervention(interventionData: Omit<Intervention, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'interventions'), {
      ...interventionData,
      triggered_at: Timestamp.now()
    });
    return docRef.id;
  }

  async updateIntervention(interventionId: string, interventionData: Partial<Intervention>): Promise<void> {
    const docRef = doc(db, 'interventions', interventionId);
    await updateDoc(docRef, {
      ...interventionData,
      updated_at: Timestamp.now()
    });
  }

  // Analytics methods
  async getAggressionTrends(dogId: string, days: number = 7): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      collection(db, 'sensor_data'),
      where('dog_id', '==', dogId),
      where('recorded_at', '>=', Timestamp.fromDate(startDate)),
      where('recorded_at', '<=', Timestamp.fromDate(endDate)),
      orderBy('recorded_at', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const trends: any[] = [];
    
    // Group by date and calculate trends
    const groupedData: { [key: string]: any[] } = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.recorded_at.toDate().toISOString().split('T')[0];
      
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(data);
    });

    Object.keys(groupedData).forEach(date => {
      const dayData = groupedData[date];
      const avgAggression = dayData.reduce((sum, item) => sum + (item.aggression_level || 0), 0) / dayData.length;
      const avgProbability = dayData.reduce((sum, item) => sum + (item.aggression_probability || 0), 0) / dayData.length;
      
      trends.push({
        date,
        aggression_level: Math.round(avgAggression),
        count: dayData.length,
        avg_probability: avgProbability
      });
    });

    return trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Utility methods
  async isOnline(): Promise<boolean> {
    try {
      // Simple connectivity check
      const testDoc = doc(db, 'test', 'connectivity');
      await getDoc(testDoc);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Cleanup method
  cleanup(): void {
    // Remove all listeners and cleanup resources
    // This would be called when the app unmounts
  }
}

export const firebaseService = new FirebaseService();
export default firebaseService;
