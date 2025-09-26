import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CharacterCardComponent } from './character-card.component';
import { Character } from '../../interfaces/ApiResponse';

describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      name: 'Earth (C-137)',
      url: 'https://rickandmortyapi.com/api/location/1'
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://rickandmortyapi.com/api/location/3'
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1']
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CharacterCardComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Set required input
    component.character = mockCharacter;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have character input property', () => {
    expect(component.character).toEqual(mockCharacter);
  });

  it('should have isPriority property with default value false', () => {
    expect(component.isPriority).toBe(false);
  });

  it('should set isPriority to true when provided', () => {
    component.isPriority = true;
    expect(component.isPriority).toBe(true);
  });

  describe('goToDetail method', () => {
    it('should navigate to character detail page', () => {
      component.goToDetail();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/characters', mockCharacter.id]);
    });

    it('should call navigate once when goToDetail is called', () => {
      component.goToDetail();
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display character name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nameElement = compiled.querySelector('[data-testid="character-name"]');
      if (nameElement) {
        expect(nameElement.textContent).toContain(mockCharacter.name);
      } else {
        // Fallback if data-testid is not used
        expect(compiled.textContent).toContain(mockCharacter.name);
      }
    });

    it('should display character image', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const imageElement = compiled.querySelector('img') as HTMLImageElement;
      expect(imageElement).toBeTruthy();
      expect(imageElement.src).toBe(mockCharacter.image);
      expect(imageElement.alt).toContain(mockCharacter.name);
    });
  });
});