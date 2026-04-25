import { Audio } from 'expo-av';

const SOUND_URLS = {
  jump: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 
  hit: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', 
  score: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', 
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3' 
};

export const playSound = async (type: 'jump' | 'hit' | 'score' | 'win') => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: SOUND_URLS[type] },
      { shouldPlay: true }
    );
    
    // Proper way to set playback status update
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    // Fail silently for offline/network issues
  }
};
