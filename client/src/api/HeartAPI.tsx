import type { HeartData } from '../interfaces/HeartData.tsx';
import type { ApiMessage } from '../interfaces/ApiMessage.tsx';
import Auth from '../utils/auth.ts';


const retrieveHearts = async () => {
  try {
    const response = await fetch('/api/heart/', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`, // Include the token
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching heart data:', err);
    return [];
  }
};

const retrieveHeartsByUser = async (userId: number) => {
  try {
    const response = await fetch(`/api/heart?UserId=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.error('Error fetching user heart data:', err);
    return [];
  }
};

const retrieveHeartById = async (id: number | null): Promise<HeartData> => {
  try {
    const response = await fetch(
      `/api/heart/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Could not invalid API response, check network tab!');
    }
    return data;
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return Promise.reject('Could not fetch heart data');
  }
}

const createHeart = async (body: HeartData) => {
  try {
    console.log('Sending heart data:', body);
    const response = await fetch(
      '/api/heart/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify(body)
    }

    )
    const data = await response.json();

    if (!response.ok) {
      console.error('Heart data creation error - Status:', response.status, 'Data:', data);
      const errorMessage = data.message || `Server error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;

  } catch (err: any) {
    console.error('Error from heart data Creation:', err);
    return Promise.reject(err.message || 'Could not create heart data');
  }
}

const updateHeart = async (heartId: number, body: HeartData): Promise<HeartData> => {
  try {
    const response = await fetch(
      `/api/heart/${heartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify(body)
    }
    )
    const data = await response.json();

    if (!response.ok) {
      throw new Error('invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.error('Update did not work', err);
    return Promise.reject('Update did not work');
  }
};

const deleteHeart = async (heartId: number): Promise<ApiMessage> => {
  try {
    const response = await fetch(
      `/api/heart/${heartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      }
    }
    )
    const data = await response.json();

    if (!response.ok) {
      throw new Error('invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.error('Error in deleting heart data', err);
    return Promise.reject('Could not delete heart data');
  }
};


export { createHeart, deleteHeart, retrieveHearts, retrieveHeartsByUser, retrieveHeartById, updateHeart };
