import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CharactersService } from './characters.service';
import { ApiResponse, Character } from '../interfaces/ApiResponse';
import { Episode } from '../interfaces/Episode';

describe('CharactersService', () => {
  let service: CharactersService;
  let httpMock: HttpTestingController;

  const mockApiResponse: ApiResponse = {
    info: {
      count: 826,
      pages: 42,
      next: 'https://rickandmortyapi.com/api/character?page=2',
      prev: null
    },
    results: [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        origin: {
          name: 'Earth (C-137)',
          url: 'https://rickandmortyapi.com/api/location/1'
        },
        location: {
          name: 'Citadel of Ricks',
          url: 'https://rickandmortyapi.com/api/location/3'
        },
        episode: ['https://rickandmortyapi.com/api/episode/1']
      }
    ]
  };

  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    origin: {
      name: 'Earth (C-137)',
      url: 'https://rickandmortyapi.com/api/location/1'
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://rickandmortyapi.com/api/location/3'
    },
    episode: ['https://rickandmortyapi.com/api/episode/1']
  };

  const mockEpisode: Episode = {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: ['https://rickandmortyapi.com/api/character/1'],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CharactersService]
    });
    service = TestBed.inject(CharactersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCharacters', () => {
    it('should return characters for page 1 by default', () => {
      service.getCharacters().subscribe(response => {
        expect(response).toEqual(mockApiResponse);
        expect(response.results).toHaveSize(1);
        expect(response.results[0].name).toBe('Rick Sanchez');
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=1');
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should return characters for specific page', () => {
      service.getCharacters(2).subscribe(response => {
        expect(response).toEqual(mockApiResponse);
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=2');
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should handle HTTP errors', () => {
      service.getCharacters().subscribe({
        next: () => fail('Should have failed with error'),
        error: (error) => {
          expect(error).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=1');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getCharacterById', () => {
    it('should return a character by id', () => {
      service.getCharacterById('1').subscribe(character => {
        expect(character).toEqual(mockCharacter);
        expect(character.name).toBe('Rick Sanchez');
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockCharacter);
    });

    it('should handle error when character not found', () => {
      service.getCharacterById('999').subscribe({
        next: () => fail('Should have failed with error'),
        error: (error) => {
          expect(error).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/999');
      req.flush('Character not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getEpisodeById', () => {
    it('should return an episode by id', () => {
      service.getEpisodeById('1').subscribe(episode => {
        expect(episode).toEqual(mockEpisode);
        expect(episode.name).toBe('Pilot');
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockEpisode);
    });
  });

  describe('getEpisodesByIds', () => {
    it('should return empty array when no ids provided', () => {
      service.getEpisodesByIds([]).subscribe(episodes => {
        expect(episodes).toEqual([]);
      });
    });

    it('should return single episode array when one id provided', () => {
      service.getEpisodesByIds(['1']).subscribe(episodes => {
        expect(episodes).toHaveSize(1);
        expect(episodes[0]).toEqual(mockEpisode);
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/1');
      req.flush(mockEpisode);
    });

    it('should return multiple episodes when multiple ids provided', () => {
      const mockEpisodes = [mockEpisode, { ...mockEpisode, id: 2, name: 'Lawnmower Dog' }];

      service.getEpisodesByIds(['1', '2']).subscribe(episodes => {
        expect(episodes).toHaveSize(2);
        expect(episodes).toEqual(mockEpisodes);
      });

      const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/1,2');
      req.flush(mockEpisodes);
    });
  });
});